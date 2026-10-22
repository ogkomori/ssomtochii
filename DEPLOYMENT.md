# Deploy and test 16 Days of Somto

This project is an installable web app (PWA). It does not need a separate Android or iPhone codebase, an app-store listing, a database, or an account system. Progress is stored in the browser on each device. An internet connection is required.

## Deploy a live test link

The frontend is in `ssomtochii-frontend/`. This is a TanStack Start app, so deploy it to a host that supports its server build rather than uploading only the static asset folder.

1. Open [Vercel](https://vercel.com/new) and sign in with GitHub.
2. Import `ogkomori/ssomtochii`.
3. Set **Root Directory** to `ssomtochii-frontend`.
4. Let Vercel detect the framework and build settings. The build command should be `npm run build`; leave the output directory at the detected/default setting.
5. Deploy and wait for the HTTPS `.vercel.app` URL.
6. Open that URL on a phone and test the normal experience.

The project is connected to GitHub, so future commits to the deployed branch should trigger a new deployment.

## Test before the calendar opens

The real schedule is based on the calendar date in `Europe/Berlin`: Day 1 opens October 23, 2026, then one new day opens each day through Day 16 on November 7.

To test every day early, open the deployed URL with `?preview=1`, for example:

`https://YOUR-DEPLOYMENT.vercel.app/?preview=1`

The home screen will say **PREVIEW MODE · ALL DAYS UNLOCKED**. The preview unlock stays active for that browser tab's session as you move between days. Close the tab to end preview mode. This does not change the actual calendar dates.

## Install it on a phone

### iPhone

1. Open the HTTPS deployment URL in **Safari**.
2. Tap **Share**.
3. Choose **Add to Home Screen** and confirm.
4. Launch it from the new home-screen icon.

### Android

1. Open the HTTPS deployment URL in **Chrome**.
2. Open the browser menu.
3. Choose **Install app** or **Add to Home screen** (the wording varies by device/browser).
4. Confirm, then launch it from the home screen/app list.

## Suggested test checklist

- Open `/?preview=1` and verify that all 16 cards are available.
- Open a day, finish its activity, and earn the wheel letter.
- Return home and refresh: the completed status and earned letter should remain.
- Reopen the completed day: its saved letter should still be shown instead of spinning again.
- On Day 4, choose a party-size option, then refresh and confirm the choice is retained for Day 5.
- Open a future day directly without preview mode; it should show a locked message rather than the story/activity.
- Install from the normal HTTPS URL (without `preview=1`) and launch from the home-screen icon.

## Local storage and limitations

- Progress is local to that browser/device; it does not sync between your phone and Somto's.
- Clearing the site's browser data removes saved progress.
- Internet is required. This app is not configured for offline use.
- Preview mode is only a testing shortcut. The real unlock schedule remains October 23–November 7, 2026.
