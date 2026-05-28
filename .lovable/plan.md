# Convert EZ Job into an Installable Web App (PWA)

Make the app installable on iPhone and Android home screens via the browser's "Add to Home Screen" flow. No app store, no native tooling required.

## What customers will experience

- They visit your published URL (`ezjob.lovable.app` or your custom domain) on their phone.
- A prompt (or browser menu → "Add to Home Screen") lets them install it.
- The app launches fullscreen from their home screen with the EZ Job icon, no browser bar.
- Works offline for previously viewed pages and loads instantly on repeat visits.

## What I'll build

1. **Install `vite-plugin-pwa`** and wire it into `vite.config.ts` with safe defaults:
   - `registerType: "autoUpdate"` so new releases roll out automatically.
   - `devOptions.enabled: false` — service worker only runs in production, never inside the Lovable editor preview.
   - `navigateFallbackDenylist: [/^\/~oauth/]` to keep auth flows untouched.
   - `NetworkFirst` strategy for HTML so users never get stuck on a stale shell.

2. **Web App Manifest** (`manifest.webmanifest`) with:
   - Name: "EZ Job", short name: "EZ Job"
   - `display: "standalone"`, `theme_color` and `background_color` matching the blue brand
   - Icons at 192×192, 512×512, and a maskable 512×512 (generated from the existing brand)
   - `start_url: "/"`, `scope: "/"`

3. **Update `index.html`** with mobile-optimized meta tags:
   - `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`
   - `apple-touch-icon` link (iOS doesn't use the manifest icons for install)
   - Theme color meta tag

4. **Iframe/preview safety guard** in `src/main.tsx` — unregister any service workers when the app loads inside the Lovable editor preview, so you keep getting fresh builds while developing.

5. **`/install` page** — a simple page with platform-aware instructions ("On iPhone: tap Share → Add to Home Screen", "On Android: tap menu → Install app") and an install button that fires the native prompt when available. You can share this link with customers.

6. **Generate PWA icons** matching the EZ Job blue brand and drop them in `public/`.

## Important caveats

- **Install prompt only works in the published/deployed site** (`ezjob.lovable.app` or your custom domain), not in the Lovable editor preview. This is a browser security requirement, not a bug.
- **iOS Safari** doesn't show an automatic install banner — users must use Share → Add to Home Screen. The `/install` page will explain this clearly.
- Once a user installs, manifest changes (name, start URL) don't update on already-installed devices until they reinstall. We'll get the manifest right the first time.
- After implementation, you'll need to **republish** the app for the PWA to go live for customers.

## Files I'll touch

- `package.json` — add `vite-plugin-pwa`
- `vite.config.ts` — register the plugin
- `index.html` — mobile meta tags + apple-touch-icon
- `src/main.tsx` — iframe/preview unregister guard
- `src/pages/Install.tsx` — new install instructions page
- `src/App.tsx` — add `/install` route
- `public/` — new icon assets (192, 512, maskable, apple-touch-icon)

After I'm done, republish the app and share `https://ezjob.lovable.app/install` with your customers.
