# Admin push notifications — how sending works

The owner sends notifications himself from Admin (in-app screen:
Account > "Admin: Send notification", or the admin web app).

## Flow
1. Owner composes title + message, picks audience (All users /
   Subscribed only) and taps Send.
2. The app saves the message into Supabase table `notifications`
   (title, body, audience, created_by, status='queued').
3. The admin server (or a Firebase Cloud Function) reads queued rows
   and sends them with Firebase Cloud Messaging (FCM) to the device
   tokens stored in `device_tokens` (registered by the app in
   `src/notifications.ts`).
4. The server marks the row `sent` with `sent_at`.

## What the owner must add (nothing here is in the app)
- Firebase project with an Android app (package
  `academy.technotrade.app`); `google-services.json` in
  `android/app/google-services.json` for the app to receive.
- Firebase **server key / service account** — put it ONLY in the
  admin server's environment / Firebase console, never in the app,
  never in chat, never in a file in this repo.
- Supabase tables (run `supabase-new-tables.sql` in SQL Editor):
  `device_tokens`, `notifications`, `subscriptions`.
- A sender: a small admin-server endpoint / Cloud Function that reads
  `notifications where status='queued'`, fetches tokens from
  `device_tokens`, and calls FCM. Until that sender exists, messages
  stay "queued" — the app says so plainly and nothing is lost.

## No Firebase yet?
The app still builds and runs without `google-services.json`:
notification registration no-ops safely and all other screens work.
