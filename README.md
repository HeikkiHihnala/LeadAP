# AGCO Power Lead Capture (PWA)

Mobile lead-collection app for the AGCO Power sales team. Runs in the browser and can be
installed to the home screen on **Android and iPhone** (Progressive Web App). No app store needed.

## Features
- Business card scan (camera) with on-device text recognition (Tesseract.js) → fields pre-filled
- Manual entry of contact details
- Engine interest from the AGCO Power range (CORE50/75/80, 33–98 HD/MD, marine, other)
- Application, annual volume, timeline, hot/warm/cold rating, next steps, owner, follow-up date
- Dictated notes (Web Speech API) – fallback: keyboard microphone or typing
- GDPR consent checkbox
- Works offline – leads are stored on the phone (IndexedDB) and synced when online
- Saves to SharePoint via Microsoft Graph: one `.json` per lead + business card photo `.jpg`
  + optional new row in `Liidit.xlsx` (table `Leads`)
- Duplicate warning (same email), CSV export, save to phone contacts (vCard), thank-you email draft
- Finnish / English UI

## Files
| File | Purpose |
|---|---|
| `index.html` | User interface |
| `app.js` | App logic (OCR, dictation, storage, sign-in, SharePoint upload) |
| `config.js` | **The only file you need to edit** (Client ID, Tenant ID, SharePoint folder, engine list) |
| `styles.css` | Look & feel |
| `sw.js` | Service worker – offline support. Change `CACHE` version on every release |
| `manifest.webmanifest`, `icons/` | Home-screen installation |
| `templates/Liidit.xlsx` | Excel template (table `Leads`) to upload into the SharePoint folder |

## Deploy (short version)
1. Create a GitHub repository and upload all files (keep the folder structure).
2. Settings → Pages → Deploy from branch `main` / root. Note the URL, e.g. `https://<org>.github.io/<repo>/`.
3. IT: create an Entra ID app registration, platform **Single-page application**, redirect URI = the Pages URL
   (with trailing slash). Delegated Microsoft Graph permissions `User.Read` and `Sites.ReadWrite.All`, grant admin consent.
4. Put the Client ID and Tenant ID into `config.js`, commit.
5. Upload `templates/Liidit.xlsx` to the SharePoint folder defined in `config.js`.
6. Open the URL on a phone, sign in, save a test lead, check SharePoint.

Without Client ID the app runs in **local mode** (leads stay on the phone, CSV export works) – useful for testing.

## Optional: host libraries locally
If the company network blocks CDNs, download `msal-browser.min.js` (npm package `@azure/msal-browser`, folder `lib/`)
into `vendor/`. The app tries `vendor/` first.

See the Finnish build guide (Word) for full step-by-step instructions.
