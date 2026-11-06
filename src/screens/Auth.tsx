import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../auth';
import { theme } from '../theme';
import { ScreenHeader } from '../components/ui';

function field(value: string, set: (v: string) => void, placeholder: string, secure = false) {
  return (
    <TextInput
      value={value}
      onChangeText={set}
      placeholder={placeholder}
      secureTextEntry={secure}
      autoCapitalize="none"
      style={{ borderWidth: 1, borderColor: theme.colors.line, borderRadius: 12, padding: 12, marginTop: 10, backgroundColor: theme.colors.card }}
    />
  );
}

export function AuthScreen({ navigation }: any) {
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError('');
    const err = mode === 'signup' ? await signUp(name, email, password) : await signIn(email, password);
    setBusy(false);
    if (err) setError(err);
    else navigation.navigate('MyLearning');
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.paper }}>
      <ScreenHeader title={mode === 'signup' ? 'Create your account' : 'Welcome back'} subtitle="Your password is stored safely, never in plain text." />
      <View style={{ padding: theme.spacing }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['signup', 'login'] as const).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              style={{ flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', backgroundColor: mode === m ? theme.colors.ink : theme.colors.card, borderWidth: 1, borderColor: theme.colors.line }}>
              <Text style={{ color: mode === m ? '#FFF' : theme.colors.ink, fontWeight: '700' }}>{m === 'signup' ? 'Sign Up' : 'Log In'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {mode === 'signup' ? field(name, setName, 'Full name') : null}
        {field(email, setEmail, 'Email address')}
        {field(password, setPassword, 'Password (at least 8 characters)', true)}
        {error ? <Text style={{ color: theme.colors.red, marginTop: 10 }}>{error}</Text> : null}
        <TouchableOpacity
          onPress={submit}
          disabled={busy}
          style={{ backgroundColor: theme.colors.amber, padding: 14, borderRadius: 12, marginTop: 16, alignItems: 'center' }}>
          <Text style={{ fontWeight: '800' }}>{busy ? 'Please wait…' : mode === 'signup' ? 'Sign Up' : 'Log In'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            setBusy(true);
            setError('');
            const err = await signInWithGoogle();
            setBusy(false);
            if (err) setError(err);
            else navigation.navigate('MyLearning');
          }}
          disabled={busy}
          style={{ backgroundColor: theme.colors.card, padding: 14, borderRadius: 12, marginTop: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.line }}>
          <Text style={{ fontWeight: '700' }}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
