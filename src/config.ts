// TechnoTrade Academy app - configuration.
// NO secrets are stored here. Fill the values below from your own
// Supabase project (Settings > API) and Razorpay dashboard (Settings >
// API Keys) before building. The anon key is a publishable key; the
// service-role key and Razorpay key secret must NEVER go in the app.
export const CONFIG = {
  // Public Supabase project URL (same project as the website).
  SUPABASE_URL: 'https://omgbvgwcycmaodqxdtbf.supabase.co',
  // TODO (owner): paste your Supabase anon public key here.
  SUPABASE_ANON_KEY: '',
  // TODO (owner): paste your Razorpay Key ID here (publishable, not secret).
  // Leave empty and checkout will show "Payment setup pending".
  RAZORPAY_KEY_ID: '',
  // FCM: add your google-services.json (Android) from your Firebase
  // project before building. See src/notifications.ts.
};

export function isConfigured(): boolean {
  return CONFIG.SUPABASE_ANON_KEY.length > 0;
}
