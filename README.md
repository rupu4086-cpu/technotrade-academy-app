# TechnoTrade Academy — fresh native app

A NEW app built from scratch (React Native + TypeScript). It is NOT a
webview wrapper of the website and does NOT copy the website's code or
Astra navy/teal design. New design: warm paper background, charcoal
ink, amber accent ("Market Amber").

## Screens
Home, Courses, Course Detail, Sign Up, Login, Pricing, Subscriptions,
My Learning, Community, Account, Checkout (Razorpay), Admin notifications.

## Rules built in
- Free users see a course's thumbnail + title + price + description only.
  Detail, curriculum and lessons unlock only after buying or subscribing.
- Subscriptions: Rs.999 / 1 month (1 course); Rs.2,999 / 1 year
  (Advanced — big traders' strategies and formulas). Access ends when
  the period ends. The owner creates plans from Admin.
- Checkout creates a PENDING order first. A course/subscription unlocks
  only after a verified captured Razorpay payment. Never marked paid
  from the app. If Razorpay is not configured, checkout says
  "Payment setup pending" and the order stays pending.
- No certificates. No ads by default.
- Data comes from the same Supabase backend as the website, via fresh
  API calls in `src/supabase.ts` (same tables: users, courses,
  course_modules, course_lessons, enrollments, lesson_progress, orders,
  payments, promo_codes, promo_redemptions, webhook_events, enquiries,
  settings, ads, community_posts, plus `subscriptions`,
  `device_tokens`, `notifications` for the new features).

## Before building — owner must add (no secrets are in this repo)
1. `src/config.ts`: paste your Supabase **anon public key** and your
   Razorpay **Key ID** (publishable only). Never put the Supabase
   service-role key or Razorpay key secret in the app.
2. Firebase (for push notifications): the project is technotrade-36811,
   Android app package `academy.technotrade.app`. `google-services.json`
   is NOT in this repo (it is git-ignored and never pushed). For a
   local build, put it in `android/app/google-services.json`. For the
   GitHub Actions build, add a repo secret named GOOGLE_SERVICES_JSON
   with the base64 of that file
   (`base64 -w0 android/app/google-services.json`); the workflow writes
   it back before building. Without the secret the build still succeeds
   but FCM stays off. The Firebase server key / service account goes
   ONLY in the admin server settings — see ADMIN_NOTIFICATIONS.md.

## Google sign-in (next step — stub only in this build)
Firebase Email + Google providers are both ON in the owner's Firebase
project, and the Auth screen has a "Continue with Google" button.
It is a stub: tapping it explains Google sign-in is not wired yet.
To wire it for real, install `@react-native-google-signin/google-signin`
(and `@react-native-firebase/app` + `@react-native-firebase/messaging`,
replacing the shim in `src/firebase-shim/`), add the google-services
Gradle plugin, and configure the Firebase web client ID + a deep-link
scheme for the OAuth redirect. That needs a native build test, so it
is deliberately NOT in this first APK build. Email sign-in works now.
3. Supabase SQL (run in SQL Editor): create the new tables
   `subscriptions`, `device_tokens`, `notifications` — see
   `supabase-new-tables.sql`. RLS: enable RLS on them; no public
   policy on `device_tokens` / `notifications` (service-role only),
   public read of active `subscriptions` only.

## Build (Android Studio on PC is the reliable route)
```
npm install
npx react-native run-android
```
Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
Release needs a keystore the owner provides — none is invented here.
