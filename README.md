# Dürümle

Static game site. The deployable files are in `dist/`.

## Mobile app

The site is installable as a Progressive Web App (PWA). On Android, open the
site in Chrome and choose **Install app**. On iPhone/iPad, open it in Safari,
tap **Share**, then **Add to Home Screen**. The first visit needs an internet
connection; after the app assets are cached, the game can also start offline.
Game progress is saved in the current browser on the current device.

## Deploy with Vercel

Import this GitHub repository into Vercel. The included `vercel.json` configures
Vercel to publish `dist/` as the output directory; no build command is required.
