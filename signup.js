// Sign-up page: new accounts only, asked in two steps so neither screen is
// crowded - who you are first, then the account itself.
//
// The student/parent answer is guidance, not permission. What an account can
// actually do is still decided by resolveAccess() in access.js: a district
// address is a student, and anything else needs an invite document from one.
// Picking "student" here grants nothing.

import {
    createUserWithEmailAndPassword,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { auth } from "./auth.js";

import {
    currentView,
    describeAuthError,
    goToWelcome,
    readPageContext,
    showMessage,
    showView,
    watchAuthState,
    wireBackButton,
    wireGoogleButton,
    wireVerificationView
} from "./auth-ui.js";

const signUpForm = document.getElementById("signup-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm-password");
const roleNote = document.getElementById("role-note");

const roleNotes = {
    student: "Use your school email address so we can tell which school you " +
        "are at.",
    parent: "Use the address your student invited. That invite is what lets " +
        "you in, so a different address will not work."
};

function chooseRole(role) {
    roleNote.textContent = roleNotes[role] || "";
    showView("signup");
    showMessage("");
}

for (const card of document.querySelectorAll(".role-card")) {
    card.addEventListener("click", () => {
        chooseRole(card.dataset.role);
    });
}

document.getElementById("create-account").addEventListener("click", () => {
    signUpForm.requestSubmit();
});

signUpForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (passwordInput.value !== confirmInput.value) {
        showMessage("The two passwords do not match.");
        return;
    }

    showMessage("Creating your account...");

    try {
        const credential = await createUserWithEmailAndPassword(
            auth,
            emailInput.value.trim(),
            passwordInput.value
        );

        showView("verification");

        // The account itself is already created, so a mail failure here is
        // not a failed sign-up and must not be reported as one.
        try {
            await sendEmailVerification(credential.user);
            showMessage("Verification email sent. Check your inbox.");
        } catch (mailError) {
            console.error(mailError);
            showMessage(
                mailError.code === "auth/quota-exceeded"
                    ? "Account created. The verification email could not be sent right now - try Resend in a little while."
                    : "Account created, but the verification email could not be sent."
            );
        }
    } catch (error) {
        console.error(error);
        showMessage(describeAuthError(error));
    }
});

wireGoogleButton("google-sign-in", "Opening Google sign-up...");
wireVerificationView();

// Back steps out of the form to the question, and off the page from there.
wireBackButton(() => {
    if (currentView() === "signup") {
        showView("role");
        showMessage("");
        return;
    }

    goToWelcome();
});

watchAuthState("role");

function start() {
    const { invited, email } = readPageContext();

    if (email) {
        emailInput.value = email;
    }

    // Someone following an invite link has already answered the question. The
    // parent note below the heading says the same thing as the invite note, so
    // only one of them is shown.
    if (invited) {
        chooseRole("parent");
        document.getElementById("role-note").textContent = "";
    }
}

start();
