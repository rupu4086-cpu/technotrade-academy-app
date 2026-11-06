import React from 'react';
import { Text, View } from 'react-native';
import { theme } from '../theme';

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ padding: theme.spacing, paddingBottom: 4 }}>
      <Text style={{ fontSize: 26, fontWeight: '800', color: theme.colors.ink }}>{title}</Text>
      {subtitle ? <Text style={{ color: theme.colors.muted, marginTop: 4 }}>{subtitle}</Text> : null}
    </View>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <View style={{ padding: 32, alignItems: 'center' }}>
      <Text style={{ color: theme.colors.muted, textAlign: 'center' }}>{text}</Text>
    </View>
  );
}
