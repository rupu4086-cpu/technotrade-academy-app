# Build status — NO APK YET (read this first)

**There is no .apk file in this folder.** Do not claim one exists.

## What is ready (verified)
- Complete fresh React Native + TypeScript app, all screens written:
  Home, Courses, Course Detail (free users see thumbnail + title +
  price + description only), Sign Up, Login, Pricing, Subscriptions
  (Rs.999 / 1 month, 1 course; Rs.2,999 / 1 year, Advanced with big
  traders' strategies and formulas), My Learning, Community, Account,
  Checkout (pending-order-first, unlock only after verified captured
  Razorpay payment), Admin notifications (FCM).
- New "Market Amber" design (warm paper, charcoal, amber) — NOT the
  website's Astra navy/teal design, NOT its logo. Fresh icon generated
  in `assets/icon.png` and Android mipmap folders.
- Splash screen (charcoal + app icon) wired in MainActivity.
- Bottom navigation: Home, Courses, My Learning, Community, Account.
- Android project generated (package `academy.technotrade.app`,
  compileSdk 34, debug keystore from the RN template for debug builds).
- `tsc --noEmit` passes clean (0 errors).
- Dependencies installed with Bun (npm fails in this VM because the
  filesystem blocks `chown` even for root; Yarn's registry handling
  is broken through the proxy).
- No secrets in any file (verified by grep): Supabase anon key and
  Razorpay Key ID are empty placeholders in `src/config.ts` for the
  owner to fill. No service-role key, no Razorpay secret, no Firebase
  server key anywhere.

## What blocked the APK in this VM (exact)
Gradle cannot run here. The Gradle daemon starts and listens on
127.0.0.1, but the client↔daemon handshake fails every time:
client reads "Unexpected type tag 109", daemon reads "type tag 0".
Verified on Gradle 8.10.2 AND 7.6.4, with a trivial `hello` task,
with a fresh Gradle user home, and with 512 MB heap. Plain Python
loopback TCP in the same VM works fine, so this is Gradle-specific
to this sandbox. Also relevant: only ~700 MB RAM is free (host
balloon), and the Android SDK manager itself cannot fetch through
the proxy (Java proxy tunnelling fails) — the SDK platform +
build-tools were installed by direct curl download instead.
`apt-get update` also hangs in this VM; JDK 17 and the SDK were
installed by direct download instead.

## Next step — build on the user's PC with Android Studio
1. Copy this whole folder to the PC.
2. Fill `src/config.ts`: Supabase anon public key + Razorpay Key ID.
3. (Optional, for push) `bun install` / `npm install`, then add
   `@react-native-firebase/app` + `@react-native-firebase/messaging`
   and put `google-services.json` in `android/app/` (see
   ADMIN_NOTIFICATIONS.md). Without it the app still builds — FCM
   stays off via the shim.
4. Run the Supabase SQL in `supabase-new-tables.sql` (creates
   `subscriptions`, `device_tokens`, `notifications` + RLS).
5. Open `android/` in Android Studio, let Gradle sync (it needs
   internet + ~4 GB RAM), then Run on a device/emulator, or
   Build > Build Bundle(s)/APK(s) > Build APK(s).
   Debug APK will be at
   `android/app/build/outputs/apk/debug/app-debug.apk`.
   Release signing needs a keystore the owner creates — none is
   invented here.
