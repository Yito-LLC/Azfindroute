// Sign-in page: existing accounts only. Creating one lives on signup.html.
// This page is also where Firebase email sign-in links land, so it owns the
// "confirm your address" and "set a password" steps that follow a link.

import {
    signInWithEmailAndPassword,
    signOut,
    isSignInWithEmailLink,
    signInWithEmailLink,
    updatePassword
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { auth, normalizeEmail } from "../core/auth.js";
import { claimParentInvites, resolveAccess } from "../core/access.js";
import { forgetEmail, recallEmail, rememberEmail, sendSignInLink } from "../core/sign-in-link.js";

import {
    describeAuthError,
    goToApp,
    goToWelcome,
    readPageContext,
    showMessage,
    showView,
    watchAuthState,
    wireBackButton,
    wireGoogleButton,
    wireVerificationView
} from "./auth-ui.js";

const signInForm = document.getElementById("signin-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const linkEmailInput = document.getElementById("link-email");
const newPasswordInput = document.getElementById("new-password");

// While either of these is on the page is mid-flow, so it must not bounce the
// user to the map yet.
let completingLink = false;
let settingPassword = false;

function clearLinkFromUrl() {
    const clean = new URL(window.location.href);

    clean.search = "";
    clean.hash = "";

    window.history.replaceState({}, "", clean);
}

document.getElementById("email-sign-in").addEventListener("click", () => {
    signInForm.requestSubmit();
});

signInForm.addEventListener("submit", async event => {
    event.preventDefault();
    showMessage("Signing in...");

    try {
        await signInWithEmailAndPassword(
            auth,
            emailInput.value.trim(),
            passwordInput.value
        );

        showMessage("");
    } catch (error) {
        console.error(error);
        showMessage(describeAuthError(error));
    }
});

// There is no password-reset mail to send: a fresh sign-in link does the same
// job, because opening one lands on the "set a password" step below. It is
// also how an invited parent who never set a password gets in.
document.getElementById("forgot-password").addEventListener("click", async () => {
    const email = normalizeEmail(emailInput.value);

    if (!email) {
        showMessage("Enter your email address above first, then try again.");
        return;
    }

    showMessage("Sending your sign-in link...");

    try {
        await sendSignInLink(email);
        rememberEmail(email);
        showMessage(
            `Sign-in link sent to ${email}. Open it on any device and you can ` +
            "set a new password."
        );
    } catch (error) {
        console.error(error);
        showMessage(describeAuthError(error));
    }
});

async function completeLinkSignIn(email, link) {
    showMessage("Signing you in...");

    try {
        const credential = await signInWithEmailLink(auth, email, link);

        forgetEmail();
        clearLinkFromUrl();

        const access = await resolveAccess(credential.user);

        if (!access.allowed) {
            completingLink = false;
            showView("signin");
            await signOut(auth);
            showMessage(
                "This site is for students with a school email and the parents " +
                "they invite. Ask your student to add you from their account."
            );
            return;
        }

        if (access.role === "parent") {
            await claimParentInvites(credential.user, access.invites);
        }

        // The account is permanent from here on. A password only saves them
        // waiting for a link next time, so it is safe to skip.
        settingPassword = true;
        completingLink = false;
        showMessage("You are signed in. Set a password to make it quicker next time.");
        showView("password");
    } catch (error) {
        console.error(error);
        completingLink = false;
        showView("signin");

        if (error.code === "auth/invalid-action-code") {
            showMessage(
                "That sign-in link has expired or was already used. Enter the " +
                "invited email above and ask for a new link."
            );
        } else if (error.code === "auth/invalid-email") {
            showMessage(
                "That email does not match the invite. Check the address and try again."
            );
        } else {
            showMessage(describeAuthError(error));
        }
    }
}

document.getElementById("complete-link").addEventListener("click", () => {
    const email = normalizeEmail(linkEmailInput.value);

    if (!email) {
        showMessage("Enter the email address your invite was sent to.");
        return;
    }

    completeLinkSignIn(email, window.location.href);
});

document.getElementById("save-password").addEventListener("click", async () => {
    const user = auth.currentUser;
    const password = newPasswordInput.value;

    if (!user) {
        settingPassword = false;
        showView("signin");
        showMessage("Your session expired. Please open your sign-in link again.");
        return;
    }

    if (password.length < 6) {
        showMessage("Use at least 6 characters.");
        return;
    }

    showMessage("Saving your password...");

    try {
        await updatePassword(user, password);

        settingPassword = false;
        showMessage("Password saved.");
        goToApp();
    } catch (error) {
        console.error(error);
        showMessage(
            error.code === "auth/requires-recent-login"
                ? "For security, open your sign-in link again before setting a password."
                : describeAuthError(error)
        );
    }
});

document.getElementById("skip-password").addEventListener("click", () => {
    settingPassword = false;
    goToApp();
});

wireGoogleButton("google-sign-in", "Opening Google sign-in...");
wireVerificationView();
wireBackButton(goToWelcome);
watchAuthState("signin", () => completingLink || settingPassword);

function start() {
    const { email } = readPageContext();

    if (isSignInWithEmailLink(auth, window.location.href)) {
        completingLink = true;

        const linkEmail = email || recallEmail();

        if (linkEmail) {
            completeLinkSignIn(linkEmail, window.location.href);
        } else {
            showView("link");
            showMessage("Confirm the email address your link was sent to.");
        }

        return;
    }

    if (email) {
        emailInput.value = email;
    }
}

start();
