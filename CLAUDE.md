# Bus Way
Static site (no build step, no framework) for the Tempe Union bus system.
Plain ES modules + Firebase Auth + Firestore, served as files.

**Run it over http, never `file://`** — ES modules do not load from disk, which
leaves a blank page. Live Server is configured on port 5501
(`.vscode/settings.json`); `http://127.0.0.1:5501` is an authorized Firebase
domain, so it works as-is.

## Active temporary changes — REVERT WHEN POSSIBLE

> Check this section at the start of any session and revert what is listed
> here once its stated condition is met, without waiting to be asked. Say what
> you reverted and why.

### 1. Invited parents skip email verification

- **Added:** 2026-10-25
- **Why:** The project's Firebase email quota was exhausted (an automated probe
  looped on `sendSignInLinkToEmail` and spent the daily allowance), so no
  verification mail could be delivered and the feature was due that day. The
  student's invite is used as the authorization instead.
- **Revert when:** the Firebase email quota has recovered — i.e.
  `sendEmailVerification` / `sendSignInLinkToEmail` no longer fail with
  `auth/quota-exceeded`. Expected within a day of 2026-10-25, so on any session
  after that date treat this as ready to revert and confirm with the user
  before removing it.
- **Risk while active:** someone who guesses an invited parent's email address
  can register it without proving they own it. The local admin UI bypass also
  lets any signed-in account pass the client-side verification gate if enabled;
  keep `developmentAdminUiBypass` false outside local testing. Firestore rules
  still require a trusted admin claim for site-wide invite management.
- **Where:** two blocks, both marked `TEMPORARY (added 2026-10-25) - REVERT THIS`
  - [main.js](main.js) — in `onAuthStateChanged`: `resolveAccess` was moved
    above the verification gate, and the gate allows parent and admin roles
    through without email verification. Reverting means putting the
    `if (!auth.currentUser.emailVerified)` check back *before* `resolveAccess`
    and removing both role exceptions.
  - [auth-ui.js](auth-ui.js) — in `watchAuthState`, which both auth pages use:
    the block that calls `resolveAccess` and sends parents or admins straight
    to the app. Reverting means deleting that block so any unverified account
    shows the verification view. (This lived in `signin.js` until the
    sign-in/sign-up split moved the shared watcher into `auth-ui.js`.)
- **Not temporary, keep it:** the `try`/`catch` around `sendEmailVerification`
  in the create-account handler in [signup.js](signup.js). That is ordinary
  error handling — a mail failure is not a failed sign-up.

### 2. `email_verified` dropped from the Firestore create rule

- **Added:** 2026-10-25
- **Why:** same exhausted email quota — the student account could not be
  verified, and the rule would have blocked every invite.
- **Revert when:** the quota has recovered and the student account's token
  carries `email_verified: true`. Restore
  `&& request.auth.token.email_verified == true` as the first condition of
  `allow create` in [firestore.rules](firestore.rules), then publish the rules
  again — editing the file alone changes nothing, it must be published.
- **Risk while active:** any signed-in account can create invites attributed to
  itself, without having proved it owns its own address.
- **Where:** the block marked `TEMPORARY (added 2026-10-25) - REVERT THIS` in
  [firestore.rules](firestore.rules).
- **Not temporary, keep it:** the split of `allow read` into `allow get`
  (with `resource == null`) and `allow list`. A `get` on a document that does
  not exist yet evaluates `resource` as null, so the old combined rule denied
  the existence check in `addParentInvite()` and broke adding a parent
  entirely. Folding those two back together reintroduces that bug.

## Pages

Auth is **one job per screen**. It was all on a single page until 2026-10-25
and people could not tell which action they were doing. Keep it split.

`welcome.html` → `signin.html` or `signup.html` → `index.html`.

- `welcome.html` / `welcome.js` — the landing screen and the signed-out
  destination (`main.js` redirects here). No form at all: logo, Login,
  Register. It also shows the "why were you signed out" message.
- `signin.html` / `signin.js` — existing accounts only. Firebase email sign-in
  links land here, so this page also owns the "confirm your address"
  (`link` view) and "set a password" (`password` view) steps. **Email links
  must keep pointing at `signInPage`, not the welcome page.**
- `signup.html` / `signup.js` — new accounts only, in two steps: the
  student/parent question (`role` view) then the form (`signup` view).
- `auth-ui.js` — everything the pages share: `showMessage`, `showView`,
  `describeAuthError`, the Google button, the verification view, the back
  chevron, the `onAuthStateChanged` redirect rules, and the invite note.
  Anything needed on more than one page belongs here, not copied twice.
- `busway-logo.png` — the wordmark, on the welcome screen and in the map
  header. It already carries the "Your school. Your route." tagline.

### How the views work

A step is a `<section data-view="name">` inside `#auth-view`; chrome that is
not a step of its own (heading, back chevron, "register instead" line) carries
`data-for-view="name other"`. `showView(name)` toggles both, and **returns
false if the page has no such step** — that is how an unverified visitor on
`welcome.html`, which has no `verification` view, gets forwarded to
`signin.html`. Adding a step means adding the section, nothing else.

### The student / parent question is guidance, not permission

`signup.html` asks, but the answer only picks which hint the form shows. Real
authorization still comes from `resolveAccess()` in `access.js` — a district
address is a student, anything else needs an invite document, unless the
account has the trusted `admin: true` claim. Do not start trusting the answer
for access decisions.

### Web Awesome styles bare `<button>` elements

`native.css` sets `display: inline-flex` and a fixed
`height: var(--wa-form-control-height)` on every plain `<button>` on a page
that loads it. Any custom button (`.role-card`, `.auth-link`) needs an explicit
`height: auto`, or its content gets clipped to one line. `index.html` does not
load Web Awesome, so its buttons are unaffected.

## How access works

- `auth.js` — Firebase app/auth/Firestore, school email domain list, and the
  `enforceSchoolEmail` flag.
- `access.js` — `resolveAccess()` returns student / parent / admin / denied. Parent
  access is a Firestore `parentInvites` document (id `<studentUid>__<email>`),
  not the invite email, so it is permanent and revocable. Admin access comes
  only from the trusted Firebase Auth custom claim `admin: true`.
- `parents.js` — the student's "Parent access" dialog.
- `sign-in-link.js` — sends Firebase email sign-in links.
- `firestore.rules` — students manage only their own invites; a parent may only
  mark their own invite active; admins may view and revoke invites across
  students.

Admins use the existing sign-in page and map. Grant the `admin: true` custom
claim only with Firebase Admin SDK in a trusted environment, never in this
static client. Publish `firestore.rules` after changing it.

`enforceSchoolEmail` in `auth.js` is **false**: every signed-in address counts
as a student so test accounts keep working. Turning it on also needs the real
district domains in `schoolEmailDomains` and the `isSchoolEmail()` check
uncommented in `firestore.rules`.

## Testing notes

**Never call `sendSignInLinkToEmail` or `sendEmailVerification` from a probe or
test script against the live project.** They send real mail and share a daily
project quota that is easy to exhaust — this already happened once (see above).
Anything that writes files inside this folder while Live Server is running will
also trigger a reload loop and re-run whatever is on the page.

Headless Chrome checks work, but `--virtual-time-budget` fast-forwards past
async auth callbacks and makes `onAuthStateChanged` look like it never fires.
Measure auth behaviour in real time instead.
