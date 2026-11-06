// Push notifications - Firebase Cloud Messaging (FCM).
// The owner sends notifications himself from Admin (see AdminNotifications
// screen + ADMIN_NOTIFICATIONS.md). The app only RECEIVES and registers
// its device token - it never sends, and it never holds a Firebase
// server key or service-account key.
//
// SETUP (owner, before building):
// 1. Firebase console > create project > add Android app
//    (package academy.technotrade.app) > download google-services.json
//    and put it in android/app/google-services.json
// 2. Firebase console > Project settings > Cloud Messaging: the server
//    key / service account goes ONLY in the admin server settings,
//    never in this app.
// Without google-services.json the functions below no-op safely and the
// app still works - notifications simply stay off until it is added.
import messaging from '@react-native-firebase/messaging';
import { supabase } from './supabase';

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const status = await messaging().requestPermission();
    return (
      status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL
    );
  } catch {
    return false; // FCM not configured yet (no google-services.json).
  }
}

export async function registerDeviceToken(userId: string | null): Promise<void> {
  try {
    const token = await messaging().getToken();
    if (!token) return;
    // Best-effort: store the token so Admin can target this device.
    // Table `device_tokens` (user_id, token, platform) must exist in
    // Supabase; if it does not, this fails silently and nothing breaks.
    await supabase.from('device_tokens').upsert(
      { user_id: userId, token, platform: 'android' },
      { onConflict: 'token' },
    );
  } catch {
    // FCM not configured yet - ignore.
  }
}

export function listenForMessages(onMessage: (title: string, body: string) => void): () => void {
  try {
    return messaging().onMessage(async (remote: any) => {
      onMessage(remote.notification?.title ?? 'TechnoTrade Academy', remote.notification?.body ?? '');
    });
  } catch {
    return () => undefined;
  }
}
