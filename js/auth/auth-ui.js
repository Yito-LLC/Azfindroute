// Shared plumbing for the two auth pages. signin.html and signup.html are
// separate pages on purpose - the same email/password fields serving both
// actions was the main thing people got wrong - but the status line, the
// Google button, the verification step and the redirect rules are identical,
// so they live here rather than being written twice.

import {
    GoogleAuthProvider,
    onAuthStateChanged,
    reload,
    sendEmailVerification,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { auth, appPage, signInPage, welcomePage, normalizeEmail } from "../core/auth.js";
import { resolveAccess, takeAccessMessage } from "../core/access.js";

const googleProvider = new GoogleAuthProvider();

const authStatus = document.getElementById("auth-status");
const inviteNote = document.getElementById("invite-note");

// Each step of a flow is a <section data-view="..."> inside the auth card, so
// a page only has to declare the steps it actually uses.
const views = new Map(
    Array.from(
        document.querySelectorAll("#auth-view section[data-view]"),
        section => [section.dataset.view, section]
    )
);

export function showMessage(message) {
    authStatus.textContent = message;
}

let shownView = "";

/**
 * Shows one step and hides the rest.
 *
 * @returns {boolean} false if this page does not have that step, so the
 *          caller can send the visitor to a page that does.
 */
export function showView(name) {
    if (!views.has(name)) return false;

    for (const [key, section] of views) {
        section.hidden = key !== name;
    }

    // Chrome that is not a step of its own - the heading, the back chevron,
    // the "register instead" line - names the views it belongs to, so it
    // comes and goes with them instead of hanging around mid-flow.
    for (const extra of document.querySelectorAll("#auth-view [data-for-view]")) {
        extra.hidden = !extra.dataset.forView.split(" ").includes(name);
    }

    shownView = name;

    return true;
}

export function currentView() {
    return shownView;
}

// Every auth page has the same back chevron in the top left. What "back" means
// depends on how far into a flow you are, so each page says.
export function wireBackButton(goBack) {
    const button = document.getElementById("auth-back");

    if (!button) return;

    button.addEventListener("click", goBack);
}

export function goToWelcome() {
    window.location.href = welcomePage;
}

export function goToApp() {
    window.location.replace(appPage);
}

// Firebase error text is written for developers ("Firebase: Error
// (auth/invalid-credential)."), and on split pages the useful part of the
// answer is usually "you are on the wrong page".
export function describeAuthError(error) {
    switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "That email and password do not match an account. Check them, " +
                "or create an account if you have not made one yet.";
        case "auth/invalid-email":
            return "That does not look like an email address.";
        case "auth/email-already-in-use":
            return "An account already exists for that email. Sign in instead.";
        case "auth/weak-password":
            return "Pick a password of at least 6 characters.";
        case "auth/too-many-requests":
            return "Too many attempts. Wait a minute and try again.";
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
            return "The Google window closed before sign-in finished.";
        case "auth/network-request-failed":
            return "No connection to the server. Check your internet and try again.";
        case "auth/quota-exceeded":
            return "Email could not be sent right now. Please try again later.";
        default:
            return error.message;
    }
}

export function wireGoogleButton(id, busyMessage) {
    const button = document.getElementById(id);

    if (!button) return;

    button.addEventListener("click", async () => {
        showMessage(busyMessage);

        try {
            await signInWithPopup(auth, googleProvider);
            showMessage("");
        } catch (error) {
            console.error(error);
            showMessage(describeAuthError(error));
        }
    });
}

// The verification step is reached from both pages: signup lands on it right
// after an account is made, signin lands on it when an unverified account
// signs back in.
export function wireVerificationView() {
    const resend = document.getElementById("resend-verification");
    const check = document.getElementById("check-verification");

    if (!resend || !check) return;

    resend.addEventListener("click", async () => {
        const user = auth.currentUser;

        if (!user) {
            showMessage("Please sign in again to resend the verification email.");
            return;
        }

        try {
            await sendEmailVerification(user);
            showMessage("Verification email sent. Check your inbox.");
        } catch (error) {
            console.error(error);
            showMessage(describeAuthError(error));
        }
    });

    check.addEventListener("click", async () => {
        const user = auth.currentUser;

        if (!user) return;

        try {
            await reload(user);

            if (auth.currentUser.emailVerified) {
                showMessage("Email verified!");
                goToApp();
            } else {
                showMessage("Your email is not verified yet. Check your inbox.");
            }
        } catch (error) {
            console.error(error);
            showMessage("Unable to check verification. Please try again.");
        }
    });
}

/**
 * Sends an already signed-in visitor on to the map, or to the verification
 * step if their email still needs confirming.
 *
 * @param {string} defaultView  the step to show when nobody is signed in
 * @param {() => boolean} isMidFlow  true while the page is in the middle of a
 *        step that must not be interrupted by a redirect
 */
export function watchAuthState(defaultView, isMidFlow = () => false) {
    onAuthStateChanged(auth, async user => {
        if (isMidFlow()) return;

        if (!user) {
            showView(defaultView);
            return;
        }

        try {
            await reload(user);

            if (auth.currentUser.emailVerified) {
                goToApp();
                return;
            }

            // ---------------------------------------------------------------
            // TEMPORARY (added 2026-10-25) - REVERT THIS
            //
            // Invited parents and explicitly authorized admins can reach the
            // map without a verified email while the Firebase email quota is
            // spent or the admin UI is being tested.
            //
            // TO REVERT: delete this block, so an unverified account always
            // lands on the verification view. See "Active temporary changes"
            // in CLAUDE.md.
            // ---------------------------------------------------------------
            const access = await resolveAccess(auth.currentUser);

            if (access.role === "parent" || access.role === "admin") {
                goToApp();
                return;
            }

            // The welcome screen has no verification step of its own, so an
            // unverified visitor who lands there goes to the page that does.
            if (!showView("verification")) {
                window.location.replace(signInPage);
                return;
            }

            showMessage("Verify your email before accessing the map.");
        } catch (error) {
            console.error(error);
            showMessage("Unable to check your account. Please try again.");
        }
    });
}

/**
 * Reads the bits of the URL both auth pages care about and shows the invite
 * note and any "why were you signed out" message.
 *
 * @returns {{ invited: boolean, email: string }}
 */
export function readPageContext() {
    const params = new URLSearchParams(window.location.search);
    const invited = params.get("invited") === "1";
    const email = normalizeEmail(params.get("email"));
    const accessMessage = takeAccessMessage();

    if (invited && inviteNote) {
        inviteNote.textContent =
            "You were invited by your student. Open the link in your invite " +
            "email to join, then set a password so you can sign in any time.";
        inviteNote.hidden = false;
    }

    if (accessMessage) {
        showMessage(accessMessage);
    }

    return { invited, email };
}
