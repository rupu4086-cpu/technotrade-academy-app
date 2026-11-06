// Auth state for the app (Supabase Auth via the anon key).
// Passwords are never stored in the app - Supabase Auth holds them.
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

export type AppUser = { id: string; email: string; name?: string };

type AuthCtx = {
  user: AppUser | null;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  // Google sign-in (Firebase Email + Google providers are both ON in
  // the owner's Firebase project, technotrade-36811). This is a stub
  // in this build: the native Google Sign-In wiring
  // (@react-native-google-signin/google-signin + google-services
  // Gradle plugin + web client ID) is NOT installed yet, because it
  // cannot be verified in this VM and would break the debug build.
  // See README "Google sign-in (next step)". Email sign-in works now.
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>(null as unknown as AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) setUser({ id: u.id, email: u.email ?? '' });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      setUser(u ? { id: u.id, email: u.email ?? '' } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    if (error) return error.message;
    if (data.user) setUser({ id: data.user.id, email: data.user.email ?? email, name });
    return null;
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (data.user) setUser({ id: data.user.id, email: data.user.email ?? email });
    return null;
  }

  async function signInWithGoogle() {
    // Stub - see the AuthCtx comment above. Do not pretend this works:
    // return the message so the Auth screen shows it to the user.
    return 'Google sign-in is not wired yet in this build - please use email sign-in for now. (Next step: install @react-native-google-signin/google-signin, add the google-services Gradle plugin and the Firebase web client ID - see README.)';
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return <Ctx.Provider value={{ user, signUp, signIn, signInWithGoogle, signOut }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
