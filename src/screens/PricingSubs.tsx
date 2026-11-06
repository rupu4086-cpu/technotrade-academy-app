import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { fetchPlans, type SubscriptionPlan } from '../supabase';
import { useAuth } from '../auth';
import { inr, theme } from '../theme';
import { ScreenHeader } from '../components/ui';

export function PricingScreen({ navigation }: any) {
  const tiers = [
    { name: 'Basic', price: 99900, note: 'Starter courses, learn at your own pace.' },
    { name: 'Pro', price: 199900, note: 'Most popular - full course library access.', popular: true },
    { name: 'Elite', price: 499900, note: 'Everything in Pro, plus advanced material.' },
  ];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.paper }}>
      <ScreenHeader title="Pricing" subtitle="One-time course prices. Subscriptions are below." />
      {tiers.map((t) => (
        <View key={t.name} style={{ backgroundColor: theme.colors.card, margin: theme.spacing, marginTop: 8, padding: theme.spacing, borderRadius: theme.radius, borderWidth: 1, borderColor: t.popular ? theme.colors.amber : theme.colors.line }}>
          <Text style={{ fontWeight: '800', fontSize: 18, color: theme.colors.ink }}>{t.name}{t.popular ? ' · Most Popular' : ''}</Text>
          <Text style={{ color: theme.colors.amberDark, fontWeight: '800', fontSize: 22, marginTop: 4 }}>{inr(t.price)}</Text>
          <Text style={{ color: theme.colors.muted, marginTop: 4 }}>{t.note}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={() => navigation.navigate('Subscriptions')} style={{ backgroundColor: theme.colors.ink, margin: theme.spacing, padding: 14, borderRadius: 12, alignItems: 'center' }}>
        <Text style={{ color: '#FFF', fontWeight: '800' }}>See subscription plans</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export function SubscriptionsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    fetchPlans().then(setPlans).catch(() => undefined);
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.paper }}>
      <ScreenHeader title="Subscriptions" subtitle="Created by the owner from Admin. Access ends automatically when the period ends." />
      {plans.map((p) => (
        <View key={p.id} style={{ backgroundColor: theme.colors.card, margin: theme.spacing, marginTop: 8, padding: theme.spacing, borderRadius: theme.radius, borderWidth: 1, borderColor: p.is_advanced ? theme.colors.amber : theme.colors.line }}>
          <Text style={{ fontWeight: '800', fontSize: 18, color: theme.colors.ink }}>{p.name}</Text>
          <Text style={{ color: theme.colors.amberDark, fontWeight: '800', fontSize: 22, marginTop: 4 }}>
            {inr(p.price_paise)} / {p.duration_days === 365 ? '1 year' : '1 month'}
          </Text>
          <Text style={{ color: theme.colors.muted, marginTop: 4 }}>{p.description}</Text>
          {p.is_advanced ? <Text style={{ color: theme.colors.green, fontWeight: '700', marginTop: 6 }}>Advanced - big traders' strategies and formulas</Text> : null}
          <TouchableOpacity
            onPress={() => (user ? navigation.navigate('Checkout', { plan: p }) : navigation.navigate('Auth'))}
            style={{ backgroundColor: theme.colors.amber, padding: 12, borderRadius: 12, marginTop: 12, alignItems: 'center' }}>
            <Text style={{ fontWeight: '800' }}>{user ? 'Subscribe' : 'Sign up to subscribe'}</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={{ padding: theme.spacing }}>
        <Text style={{ color: theme.colors.muted, fontSize: 12 }}>A subscription gives access to 1 course for its period only. After the period ends, access stops until you renew.</Text>
      </View>
    </ScrollView>
  );
}
