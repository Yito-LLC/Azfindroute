# Busway.com
Repository to help with the Tempe Union Bus System.

## Pages

The HTML pages sit at the top level (sent emails link to `/signin.html`);
scripts are in `js/core/` (shared), `js/auth/` and `js/map/`, styles in
`css/`, images in `assets/`.

- `welcome.html` / `js/auth/welcome.js` — the landing screen, and the way back in when
  you are signed out. It carries no form: just the logo, **Login** and
  **Register**. Everything else is one screen per job behind it. The shared
  footer links to site information and support.
- `signin.html` / `js/auth/signin.js` — signing an existing account in: email and
  password, or Google. "Forgot password?" emails a sign-in link, because
  opening one lands on the "set a password" step. Firebase email links land
  here too, so this page also owns "confirm your address" and "set a password".
- `signup.html` / `js/auth/signup.js` — creating a new account, in two steps. Step one
  asks whether you are a student or a parent; step two is the form. Keeping it
  apart from `signin.html` is deliberate: one set of email and password fields
  serving both actions was the thing people got wrong.
- `js/auth/auth-ui.js` — the parts the auth pages share: the status line, the Google
  button, the verification step, friendly wording for Firebase error codes, the
  back chevron and the redirect rules. Each step of a flow is a
  `<section data-view="...">` and the chrome around it carries
  `data-for-view="..."`, so a page declares only the steps it uses and headings
  do not linger into the wrong step.
- `index.html` / `js/map/main.js` — the map app. Redirects to `welcome.html` when
  nobody is signed in or the email is not verified yet.
- `js/core/auth.js` — shared Firebase app, auth and Firestore instances, plus the
  school email domain list.
- `js/core/access.js` — works out whether an account may use the site and as what
  (student, invited parent, or admin), and stores the parent invites.
- `js/map/parents.js` — the "Parent access" dialog students use to add their parents.
- `js/core/sign-in-link.js` — sends the email sign-in links used by invites.
- `js/map/bus-stop-layers.js` / `js/map/bus-stops.js` — the stop dots, their
  cards, and the stop data they are drawn from.
- `firestore.rules` — security rules for the parent invites.
- `css/style.css` — shared styles for every page.
- `site-info.html` — privacy policy, terms of use, accessibility information,
  and help/FAQ, linked from the footer on every page.
- `js/core/i18n.js` — shared English, Simplified Chinese, and Spanish translations.
  Choose a language in any page footer; the choice is saved in local storage
  and reused on other pages in the same browser.
- `assets/busway-logo.png` — the Busway wordmark, used on both auth pages and in
  the map page header.

## Running it

Every page loads its code as ES modules, which browsers refuse to read over
`file://`. Opening `index.html` straight from the folder therefore shows a blank
page, so the pages now detect that and say so instead. Serve the folder over
http instead:

```
python -m http.server 8000
```

then open `http://localhost:8000/index.html`. The VS Code Live Server extension
works too.

## Accounts and access

Sign out, the signed-in address and the parent controls all sit in the top
right corner of the map page.

The **student or parent** question on `signup.html` is guidance, not
permission. What an account can actually do is still decided by
`resolveAccess()` in `access.js`, so picking "student" grants nothing on its
own — it only changes which hint the form shows.

Students sign in with a school email. Parents do not have one, so a student
adds them instead:

1. The student opens **Parent access** and enters the parent's email.
2. That writes a `parentInvites` document (id `<studentUid>__<parent email>`)
   and emails the parent a Firebase sign-in link.
3. The parent opens the link, which creates their real account, and is asked to
   set a password.

The invite document, not the email, is what grants access, so it is permanent:
the parent signs in with their email and password from then on. "Forgot
password?" on the sign-in page gets them back in if they skipped the password
or forgot it — it sends a fresh link, and opening one offers the password step
again. The student can cancel an invite or remove a parent's access at any
time, and siblings can each invite the same parent.

The school email rule is written but switched off: `enforceSchoolEmail` in
`auth.js` is `false`, so any signed-in address currently counts as a student.
Set `schoolEmailDomains` to the district's real domains, flip the flag to
`true`, then uncomment the matching `isSchoolEmail()` check in
`firestore.rules`.

### Admin access

Admins use the regular sign-in page and the existing Firebase Authentication
account. Access is granted only when the account's ID token contains the
trusted custom claim `admin: true`; an email address or client-side setting is
not sufficient. Admins can use the map and review, resend pending, or revoke
parent invites across all students. They cannot create invites on behalf of a
student.

For local UI testing only, `developmentAdminUiBypass` in `access.js` can be
set to `true`. This treats every signed-in account as an admin in the client
and lets it through the email-verification screen, so never enable it in
deployed code. Firestore still enforces the custom claim: without it, site-wide
invite listing and revocation will be denied.

Assign the claim only from a trusted environment with Firebase Admin SDK
credentials, after creating the account in Firebase Authentication. Never put
Admin SDK credentials or claim-setting code in this static site. Preserve any
existing custom claims when setting it:

```js
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

initializeApp({ credential: applicationDefault() });

const adminAuth = getAuth();
const user = await adminAuth.getUser(uid);
await adminAuth.setCustomUserClaims(uid, {
  ...user.customClaims,
  admin: true
});
```

Remove the `admin` property from the claims to revoke admin access. Have the
user sign out and back in (or refresh their ID token) for claim changes to take
effect. Publish the updated Firestore rules with
`firebase deploy --only firestore:rules`; until then, admin invite management
will be denied by Firestore.

### Firebase setup this needs

- Firestore enabled, with `firestore.rules` deployed
  (`firebase deploy --only firestore:rules`).
- Authentication → Sign-in method → Email/Password with **Email link
  (passwordless sign-in)** turned on.
- The site's domain listed under Authentication → Settings → Authorized
  domains. Email links do not work from `file://`, so serve the pages over
  http(s) while testing.

## Map

The map is powered by Mapbox GL JS and opens in 3D. Use the map control to switch
between 3D and 2D. Enter an Arizona address and choose a school to pin the
nearest mapped stop associated with that school and draw the fastest available
walking route from that stop to the address. Address suggestions are limited to
Arizona and appear as you type.
The map reports the route distance and estimated walking time; a separate pin
marks the address. Walking routes require the Mapbox Directions API to be
enabled for the access token.

The map is constrained to the Phoenix-area bounds from Buckeye on the west to
Florence on the east, Peora on the north, and just north of Casa Grande on the
south. Panning cannot move outside this area, and the minimum zoom adjusts to
the viewport size to keep the view within itAddress lookup remains limited
to Arizona