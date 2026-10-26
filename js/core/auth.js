import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBktWFz-RbKArY3MHhkpz4dPYPI1nL7h40",
    authDomain: "azfindroute.firebaseapp.com",
    projectId: "azfindroute",
    storageBucket: "azfindroute.firebasestorage.app",
    messagingSenderId: "677958021997",
    appId: "1:677958021997:web:23e8a3ae037d98a42da064",
    measurementId: "G-EDF773BX22"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const welcomePage = "welcome.html";
export const signInPage = "signin.html";
export const signUpPage = "signup.html";
export const appPage = "index.html";

// Students sign in with a district address. Parents never have one, so they get
// in through an invite from their student instead (see access.js).
export const schoolEmailDomains = ["tuhsd.k12.az.us"];

// Flip this to true once the domain list above is confirmed with the district.
// While it is false every signed-in address counts as a student, so test
// accounts keep working, but parent invites are already stored and honored.
export const enforceSchoolEmail = false;

// ---------------------------------------------------------------
// TEMPORARY DEMO MODE - turn off after judging
//
// While true, the role picked at sign-up (student, parent or bus driver) is
// honored as-is, email verification is skipped, and the account menu lets
// anyone switch role. Turn it off here AND in demoMode() in firestore.rules
// (then publish the rules). See "Active temporary changes" in CLAUDE.md.
// ---------------------------------------------------------------
export const demoMode = true;

export function normalizeEmail(email) {
    return (email || "").trim().toLowerCase();
}

export function isSchoolEmail(email) {
    const domain = normalizeEmail(email).split("@")[1];

    return Boolean(domain) && schoolEmailDomains.includes(domain);
}
