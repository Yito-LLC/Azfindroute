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
 * - a district address is a student
 * - anything else needs a parent invite from a student
 */
export async function resolveAccess(user) {
    if (developmentAdminUiBypass) {
        return { allowed: true, role: "admin", invites: [] };
    }

    const token = await user.getIdTokenResult();

    if (token.claims.admin === true) {
        return { allowed: true, role: "admin", invites: [] };
    }

    const email = normalizeEmail(user.email);

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
