import { sendSignInLinkToEmail } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { auth, normalizeEmail, signInPage } from "./auth.js";

// Firebase needs the address again when the link is opened. Parents click the
// link on their own device, so the address also travels in the link itself.
export const storedEmailKey = "azfindroute:sign-in-email";

export function rememberEmail(email) {
    try {
        window.localStorage.setItem(storedEmailKey, normalizeEmail(email));
    } catch (error) {
        console.error(error);
    }
}

export function recallEmail() {
    try {
        return window.localStorage.getItem(storedEmailKey) || "";
    } catch (error) {
        console.error(error);
        return "";
    }
}

export function forgetEmail() {
    try {
        window.localStorage.removeItem(storedEmailKey);
    } catch (error) {
        console.error(error);
    }
}

function signInLinkTarget(email, invited) {
    const url = new URL(signInPage, window.location.href);

    url.searchParams.set("email", email);

    if (invited) {
        url.searchParams.set("invited", "1");
    }

    return url.toString();
}

export async function sendSignInLink(email, { invited = false } = {}) {
    const address = normalizeEmail(email);

    await sendSignInLinkToEmail(auth, address, {
        url: signInLinkTarget(address, invited),
        handleCodeInApp: true
    });

    return address;
}
