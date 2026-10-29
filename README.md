# Dürümle: Mahallenin Ustası

The browser game is published from `dist/`. Capacitor packages the same game
assets as native Android and iOS applications.

## Web and PWA

On Android, open the site in Chrome and choose **Install app**. On iPhone/iPad,
open it in Safari, tap **Share**, then **Add to Home Screen**. After the first
visit has cached the app, the game can also start offline. Game progress is
saved in the current browser on the current device.

## Prepare native mobile projects

Install Node.js 22 or later. From the project root, run:

```sh
npm install
npm run cap:add:android
```

The native project folders are generated locally and are intentionally not
checked in. After changing files in `dist/`, run `npm run cap:sync` to copy the
latest game into both native projects. `assets/logo.svg` is the source logo
used to generate native launcher icons and splash screens.

On a Mac, run `npm run cap:add:ios` as well. After adding each platform, run
`npm run cap:assets` to generate its launcher icons and splash screens, and
`npm run cap:sync` to copy the game assets. Run `npm run cap:sync` again after
updating the web game.

### Android

Install Android Studio 2025.2.1 or later and an Android SDK. Open the Android
project with `npm run cap:open:android`, test it on a device, then create a
signed Android App Bundle (AAB) from Android Studio for Google Play. Keep the
upload key and its passwords backed up securely; never commit them.

### iOS

iOS builds require macOS, Xcode 26 or later, and an Apple Developer account.
Run `npm run cap:open:ios` on a Mac, configure the app's signing team in Xcode,
test on a real iPhone/iPad, and upload an archive to App Store Connect.

## Before store submission

- Choose final store screenshots, descriptions, age ratings, and support links.
- Publish a privacy policy and provide its public URL in each store listing.
- The game uses the name and branding “Dürümle” and describes itself as a fan
  game. Obtain written permission from the trademark owner, or rebrand the
  game before submitting it to either store.
- App Store and Google Play approval is decided by each store; a native
  Capacitor package does not guarantee acceptance.

The configured application ID is `com.mekiciepcas.durumle`. Changing it after
the native projects are generated requires updating the platform projects too.

## Vercel

Import this GitHub repository into Vercel. `vercel.json` configures Vercel to
publish `dist/`; no build command is required.
