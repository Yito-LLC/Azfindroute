import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

import {
    db,
    demoMode,
    enforceSchoolEmail,
    isSchoolEmail,
    normalizeEmail
} from "./auth.js";

// Development-only UI bypass. Keep false outside local testing; Firestore
// still requires the trusted admin custom claim for site-wide invite access.
const developmentAdminUiBypass = true;

// One document per student/parent pair, so siblings can each invite the same
// parent and either of them can revoke only their own invite.
const parentInvites = collection(db, "parentInvites");

// One document per bus driver, keyed by their normalized email. Only an admin
// with the trusted claim can add or remove one, so picking "bus driver" at
// sign-up grants nothing on its own.
const busDrivers = collection(db, "busDrivers");

export function inviteId(studentUid, parentEmail) {
    return `${studentUid}__${normalizeEmail(parentEmail)}`;
}

function toInvite(snapshot) {
    return { id: snapshot.id, ...snapshot.data() };
}

export async function invitesForStudent(studentUid) {
    const snapshot = await getDocs(
        query(parentInvites, where("studentUid", "==", studentUid))
    );

    return snapshot.docs.map(toInvite);
}

export async function invitesForAdmin() {
    const snapshot = await getDocs(parentInvites);

    return snapshot.docs.map(toInvite);
}

export async function invitesForParent(email) {
    const snapshot = await getDocs(
        query(parentInvites, where("parentEmail", "==", normalizeEmail(email)))
    );

    return snapshot.docs.map(toInvite);
}

export async function addParentInvite(student, parentEmail) {
    const email = normalizeEmail(parentEmail);
    const id = inviteId(student.uid, email);

    // This lookup only decides which message the dialog shows, so it must not
    // be able to stop an invite. Reading a document that does not exist yet is
    // easy to get denied by rules, and that is not a reason to refuse the add.
    try {
        const existing = await getDoc(doc(parentInvites, id));

        if (existing.exists()) {
            return { invite: toInvite(existing), created: false };
        }
    } catch (error) {
        console.error(error);
    }

    const invite = {
        parentEmail: email,
        studentUid: student.uid,
        studentEmail: normalizeEmail(student.email),
        status: "pending",
        parentUid: null,
        createdAt: serverTimestamp(),
        acceptedAt: null
    };

    await setDoc(doc(parentInvites, id), invite);

    return { invite: { id, ...invite }, created: true };
}

export async function removeParentInvite(id) {
    await deleteDoc(doc(parentInvites, id));
}

// Demo mode only: the role a visitor picked, kept in demoRoles/<uid>. The pick
// is made on signup.html before the account exists, so it waits in
// localStorage until the map page can save it.
const pendingDemoRoleKey = "busway:demo-role";
export const demoRoles = ["student", "parent", "driver"];

export function savePendingDemoRole(role) {
    try {
        localStorage.setItem(pendingDemoRoleKey, role);
    } catch (error) {
        console.warn("Could not remember the demo role.", error);
    }
}

export async function applyPendingDemoRole(user) {
    let role = null;

    try {
        role = localStorage.getItem(pendingDemoRoleKey);
        localStorage.removeItem(pendingDemoRoleKey);
    } catch (error) {
        console.warn("Could not read the demo role.", error);
    }

    if (demoRoles.includes(role)) await setDemoRole(user, role);
}

// An empty role removes the pick, so the account goes back to its real role.
export async function setDemoRole(user, role) {
    const roleDoc = doc(db, "demoRoles", user.uid);

    if (role) await setDoc(roleDoc, { role });
    else await deleteDoc(roleDoc);
}

async function demoRoleFor(user) {
    try {
        const snapshot = await getDoc(doc(db, "demoRoles", user.uid));
        const role = snapshot.data()?.role;

        return demoRoles.includes(role) ? role : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function isBusDriver(email) {
    const snapshot = await getDoc(doc(busDrivers, normalizeEmail(email)));

    return snapshot.exists();
}

export async function driversForAdmin() {
    const snapshot = await getDocs(busDrivers);

    return snapshot.docs.map(driver => ({ id: driver.id, ...driver.data() }));
}

export async function addBusDriver(admin, driverEmail) {
    const email = normalizeEmail(driverEmail);

    await setDoc(doc(busDrivers, email), {
        email,
        addedBy: normalizeEmail(admin.email),
        addedAt: serverTimestamp()
    });
}

export async function removeBusDriver(email) {
    await deleteDoc(doc(busDrivers, normalizeEmail(email)));
}

// Called the first time an invited parent actually signs in. The invite is the
// parent's permanent key to the site, so this only records that they arrived.
export async function claimParentInvites(user, invites) {
    const unclaimed = invites.filter(invite => invite.parentUid !== user.uid);

    await Promise.all(
        unclaimed.map(invite =>
            updateDoc(doc(parentInvites, invite.id), {
                status: "active",
                parentUid: user.uid,
                acceptedAt: serverTimestamp()
            }).catch(error => {
                console.error(error);
            })
        )
    );
}

/**
 * Works out whether a signed-in account may use the app and as what.
 *
 * - a trusted Firebase Auth admin claim grants admin access
 * - a busDrivers document an admin created is a bus driver
 * - a district address is a student
 * - anything else needs a parent invite from a student
 */
export async function resolveAccess(user) {
    if (demoMode) {
        const role = await demoRoleFor(user);

        if (role) return { allowed: true, role, invites: [], demo: true };
    }

    if (developmentAdminUiBypass) {
        return { allowed: true, role: "admin", invites: [] };
    }

    const token = await user.getIdTokenResult();

    if (token.claims.admin === true) {
        return { allowed: true, role: "admin", invites: [] };
    }

    const email = normalizeEmail(user.email);

    try {
        if (await isBusDriver(email)) {
            return { allowed: true, role: "driver", invites: [] };
        }
    } catch (error) {
        // Not being able to check only costs the driver tools; the account can
        // still be a student or parent below.
        console.error(error);
    }

    if (isSchoolEmail(email)) {
        return { allowed: true, role: "student", invites: [] };
    }

    let invites = [];

    try {
        invites = await invitesForParent(email);
    } catch (error) {
        // A Firestore outage should not lock everyone out while the school
        // email rule is still off.
        console.error(error);

        return enforceSchoolEmail
            ? { allowed: false, role: "unknown", invites: [], reason: "lookup-failed" }
            : { allowed: true, role: "student", invites: [], reason: "lookup-failed" };
    }

    if (invites.length) {
        return { allowed: true, role: "parent", invites };
    }

    if (!enforceSchoolEmail) {
        return { allowed: true, role: "student", invites: [], reason: "unenforced" };
    }

    return { allowed: false, role: "unknown", invites: [], reason: "no-school-email" };
}

// Carries the "why were you kicked out" note across the redirect to signin.html.
const accessMessageKey = "azfindroute:access-message";

export function setAccessMessage(message) {
    try {
        window.sessionStorage.setItem(accessMessageKey, message);
    } catch (error) {
        console.error(error);
    }
}

export function takeAccessMessage() {
    try {
        const message = window.sessionStorage.getItem(accessMessageKey) || "";

        window.sessionStorage.removeItem(accessMessageKey);

        return message;
    } catch (error) {
        console.error(error);
        return "";
    }
}
