import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { AuthProvider, useAuth } from './src/auth';
import { AppNavigator } from './src/navigation';
import { listenForMessages, registerDeviceToken, requestNotificationPermission } from './src/notifications';

function Inner() {
  const { user } = useAuth();

  useEffect(() => {
    requestNotificationPermission().then((ok) => {
      if (ok) registerDeviceToken(user?.id ?? null).catch(() => undefined);
    });
    const off = listenForMessages((title, body) => Alert.alert(title, body));
    return off;
  }, [user]);

  return <AppNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}
