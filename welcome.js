// The landing screen. It carries no form at all - its whole job is to split
// "I already have an account" from "I need one", so neither of the pages
// behind it has to show both at once.

import { signInPage, signUpPage } from "./auth.js";
import { readPageContext, watchAuthState } from "./auth-ui.js";

document.getElementById("go-signin").addEventListener("click", () => {
    window.location.href = signInPage;
});

document.getElementById("go-signup").addEventListener("click", () => {
    window.location.href = signUpPage;
});

// Someone already signed in goes straight to the map, and anyone bounced off
// the map lands here with the reason why.
watchAuthState("welcome");
readPageContext();
