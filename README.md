# Az Find Route.com
Repository to help with the Tempe Union Bus System.

## Pages

- `welcome.html` / `welcome.js` — the landing screen, and the way back in when
  you are signed out. It carries no form: just the logo, **Login** and
  **Register**. Everything else is one screen per job behind it.
- `signin.html` / `signin.js` — signing an existing account in: email and
  password, or Google. "Forgot password?" emails a sign-in link, because
  opening one lands on the "set a password" step. Firebase email links land
  here too, so this page also owns "confirm your address" and "set a password".
- `signup.html` / `signup.js` — creating a new account, in two steps. Step one
  asks whether you are a student or a parent; step two is the form. Keeping it
  apart from `signin.html` is deliberate: one set of email and password fields
  serving both actions was the thing people got wrong.
- `auth-ui.js` — the parts the auth pages share: the status line, the Google
  button, the verification step, friendly wording for Firebase error codes, the
  back chevron and the redirect rules. Each step of a flow is a
  `<section data-view="...">` and the chrome around it carries
  `data-for-view="..."`, so a page declares only the steps it uses and headings
  do not linger into the wrong step.
- `index.html` / `main.js` — the map app. Redirects to `welcome.html` when
  nobody is signed in or the email is not verified yet.
- `auth.js` — shared Firebase app, auth and Firestore instances, plus the
  school email domain list.
- `access.js` — works out whether an account may use the site and as what
  (student or invited parent), and stores the parent invites.
- `parents.js` — the "Parent access" dialog students use to add their parents.
- `sign-in-link.js` — sends the email sign-in links used by invites.
- `firestore.rules` — security rules for the parent invites.
- `style.css` — shared styles for every page.
- `busway-logo.png` — the Busway wordmark, used on both auth pages and in
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
between 3D and 2D. Enter an address and press Enter to geocode it and place a pin
on the map, zooming in to street level.

If you zoom out below level 5, the map recenters on your most recently searched
address, or on Arizona if you have not searched for an address yet.

The Mapbox public access token is configured in the `mapbox-access-token` meta
tag in `index.html`. The token needs Mapbox GL JS, Search JS, and Geocoding API
access.
