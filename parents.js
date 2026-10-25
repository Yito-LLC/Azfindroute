import { normalizeEmail } from "./auth.js";
import {
    addParentInvite,
    invitesForAdmin,
    invitesForStudent,
    removeParentInvite
} from "./access.js";
import { sendSignInLink } from "./sign-in-link.js";

const dialog = document.getElementById("parents-dialog");
const openButton = document.getElementById("manage-parents");
const closeButton = document.getElementById("parents-close");
const parentForm = document.getElementById("parent-form");
const parentInput = document.getElementById("parent-email");
const parentStatus = document.getElementById("parent-status");
const parentList = document.getElementById("parent-list");

let student = null;
let invites = [];
let busy = false;
let adminMode = false;

function showMessage(message) {
    parentStatus.textContent = message;
}

// The parent is already added at this point, so say so first and explain how
// they get in without the email.
function describeMailFailure(email, error) {
    const added = `${email} has been added and can sign in.`;
    const howTo =
        " To get in without the email: open the Create account page " +
        "(signup.html), enter this address and pick a password.";

    if (error.code === "auth/quota-exceeded") {
        return `${added} The invite email could not be sent - the project's ` +
            `daily email limit is used up.${howTo}`;
    }

    return `${added} The invite email could not be sent (${error.code || error.message}).${howTo}`;
}

function describeInviteFailure(error) {
    switch (error.code) {
        case "auth/invalid-email":
            return "That email address does not look right.";
        case "permission-denied":
            return "Firestore refused this action. Check that firestore.rules " +
                "has been published and that your account has permission.";
        case "unavailable":
        case "failed-precondition":
            return "Could not reach Firestore. Check that Firestore is " +
                "enabled for this Firebase project.";
        default:
            return `Could not add that parent (${error.code || error.message}).`;
    }
}

function formatDate(timestamp) {
    const date = timestamp?.toDate?.();

    if (!date) return "";

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function inviteRow(invite) {
    const item = document.createElement("li");
    item.className = adminMode ? "parent-row is-admin-row" : "parent-row";

    if (adminMode) {
        const studentEmail = document.createElement("span");
        studentEmail.className = "parent-row-student";
        studentEmail.textContent = invite.studentEmail || "Unknown student";
        item.append(studentEmail);
    }

    const email = document.createElement("span");
    email.className = "parent-row-email";
    email.textContent = invite.parentEmail;

    const state = document.createElement("span");
    const joined = invite.status === "active";
    state.className = `parent-row-state ${joined ? "is-joined" : "is-pending"}`;
    state.textContent = joined
        ? `Joined${formatDate(invite.acceptedAt) ? ` · ${formatDate(invite.acceptedAt)}` : ""}`
        : `Invite sent${formatDate(invite.createdAt) ? ` · ${formatDate(invite.createdAt)}` : ""}`;

    const actions = document.createElement("span");
    actions.className = "parent-row-actions";

    if (!joined) {
        const resend = document.createElement("button");
        resend.type = "button";
        resend.className = "parent-row-button";
        resend.textContent = "Resend";

        resend.addEventListener("click", async () => {
            if (busy) return;

            busy = true;
            showMessage(`Sending another invite to ${invite.parentEmail}…`);

            try {
                await sendSignInLink(invite.parentEmail, { invited: true });
                showMessage(`Invite resent to ${invite.parentEmail}.`);
            } catch (error) {
                console.error(error);
                showMessage(describeMailFailure(invite.parentEmail, error));
            } finally {
                busy = false;
            }
        });

        actions.append(resend);
    }

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "parent-row-button is-danger";
    remove.textContent = joined ? "Remove access" : "Cancel invite";

    remove.addEventListener("click", async () => {
        if (busy) return;

        const confirmed = window.confirm(
            `Remove ${invite.parentEmail}? They will not be able to sign in any more.`
        );

        if (!confirmed) return;

        busy = true;
        showMessage(`Removing ${invite.parentEmail}…`);

        try {
            await removeParentInvite(invite.id);
            await refresh();
            showMessage(`${invite.parentEmail} no longer has access.`);
        } catch (error) {
            console.error(error);
            showMessage("Could not remove that parent. Please try again.");
        } finally {
            busy = false;
        }
    });

    actions.append(remove);
    item.append(email, state, actions);

    return item;
}

function renderInvites() {
    parentList.replaceChildren();

    if (!invites.length) {
        const empty = document.createElement("li");
        empty.className = "parent-row is-empty";
        empty.textContent = adminMode
            ? "No parent invites found."
            : "No parents added yet.";
        parentList.append(empty);
        return;
    }

    const sorted = [...invites].sort((a, b) => {
        if (adminMode) {
            const studentOrder = (a.studentEmail || "").localeCompare(b.studentEmail || "");

            if (studentOrder) return studentOrder;
        }

        return a.parentEmail.localeCompare(b.parentEmail);
    });

    for (const invite of sorted) {
        parentList.append(inviteRow(invite));
    }
}

async function refresh() {
    invites = adminMode
        ? await invitesForAdmin()
        : await invitesForStudent(student.uid);

    renderInvites();
}

parentForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (busy) return;

    const email = normalizeEmail(parentInput.value);

    if (adminMode) return;

    if (!email) {
        showMessage("Enter your parent's email address.");
        return;
    }

    if (email === normalizeEmail(student.email)) {
        showMessage("That is your own address. Use your parent's email.");
        return;
    }

    busy = true;
    showMessage(`Inviting ${email}…`);

    try {
        const { created } = await addParentInvite(student, email);

        // The invite document is what grants access - the email is only how we
        // tell the parent about it. A mail failure is not a failed invite, so
        // the list is refreshed and the parent stays added either way.
        await refresh();
        parentInput.value = "";

        try {
            await sendSignInLink(email, { invited: true });
            showMessage(
                created
                    ? `Invite sent to ${email}. They can sign in as soon as they open it.`
                    : `${email} was already added, so we sent the invite again.`
            );
        } catch (mailError) {
            console.error(mailError);
            showMessage(describeMailFailure(email, mailError));
        }
    } catch (error) {
        console.error(error);
        showMessage(describeInviteFailure(error));
    } finally {
        busy = false;
    }
});

openButton.addEventListener("click", async () => {
    showMessage("");
    dialog.showModal();

    try {
        await refresh();
    } catch (error) {
        console.error(error);
        showMessage(
            adminMode
                ? "Could not load parent invites. Please try again."
                : "Could not load your parents. Please try again."
        );
    }
});

closeButton.addEventListener("click", () => {
    dialog.close();
});

export function initParentManager(user, role = "student") {
    student = user;
    adminMode = role === "admin";
    document.getElementById("parents-title").textContent = adminMode
        ? "Parent invites"
        : "Parent access";
    document.getElementById("parents-hint").textContent = adminMode
        ? "Review invites across all students, resend pending invitations, or revoke access."
        : "Parents do not have a school email, so add them here. They get an invite email with a sign-in link, and once they open it they can set a password and sign in whenever they like.";
    parentForm.hidden = adminMode;
    openButton.hidden = false;
}
