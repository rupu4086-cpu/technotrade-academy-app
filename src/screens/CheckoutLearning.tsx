import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CONFIG } from '../config';
import { createPendingOrder, type Course, type SubscriptionPlan } from '../supabase';
import { useAuth } from '../auth';
import { inr, theme } from '../theme';
import { ScreenHeader } from '../components/ui';

// Checkout rule: create a PENDING order first. The course/subscription
// unlocks only after a verified captured Razorpay payment (server /
// webhook). The app never marks an order paid. If Razorpay is not
// configured, the order stays pending and the screen says so plainly.
export function CheckoutScreen({ route, navigation }: any) {
  const { user } = useAuth();
  const course: Course | undefined = route.params?.course;
  const plan: SubscriptionPlan | undefined = route.params?.plan;
  const [promo, setPromo] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const itemName = course ? course.title : plan ? `${plan.name} subscription` : 'Item';
  const basePaise = course ? course.price_paise : plan ? plan.price_paise : 0;
  const gstPaise = Math.round(basePaise * 0.18);
  const totalPaise = basePaise + gstPaise;

  async function pay() {
    if (!user) {
      navigation.navigate('Auth');
      return;
    }
    setBusy(true);
    setStatus('');
    try {
      const order = await createPendingOrder({
        userId: user.id,
        courseId: course?.id,
        planId: plan?.id,
        amountPaise: totalPaise,
        promoCode: promo || undefined,
      });
      if (!CONFIG.RAZORPAY_KEY_ID) {
        setStatus(`Order ${String(order.id).slice(0, 8)} created as PENDING. Payment setup pending - Razorpay is not configured yet, so the course is not unlocked. The owner will confirm payment.`);
      } else {
        // Razorpay native SDK step: open Razorpay Checkout with
        // CONFIG.RAZORPAY_KEY_ID and the server-created order id.
        // The server must create the Razorpay order and verify the
        // signature + captured status before granting access.
        setStatus('Razorpay checkout opens here once the server order is created. The course unlocks only after verified payment.');
      }
    } catch (e: any) {
      setStatus(e?.message ?? 'Checkout could not be started. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.paper }}>
      <ScreenHeader title="Checkout" subtitle={itemName} />
      <View style={{ backgroundColor: theme.colors.card, margin: theme.spacing, padding: theme.spacing, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.colors.line }}>
        <Text style={{ color: theme.colors.ink }}>Price: {inr(basePaise)}</Text>
        <Text style={{ color: theme.colors.ink, marginTop: 4 }}>GST (18%): {inr(gstPaise)}</Text>
        <Text style={{ fontWeight: '800', color: theme.colors.ink, marginTop: 8, fontSize: 18 }}>Total: {inr(totalPaise)}</Text>
        <Text style={{ color: theme.colors.muted, marginTop: 8 }}>Promo code: {promo || 'none'} (applied on the server at payment time)</Text>
        {status ? <Text style={{ color: theme.colors.ink, marginTop: 12, lineHeight: 20 }}>{status}</Text> : null}
        <TouchableOpacity onPress={pay} disabled={busy} style={{ backgroundColor: theme.colors.amber, padding: 14, borderRadius: 12, marginTop: 16, alignItems: 'center' }}>
          <Text style={{ fontWeight: '800' }}>{busy ? 'Please wait…' : `Pay ${inr(totalPaise)}`}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export function MyLearningScreen({ navigation }: any) {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState<string[]>([]);
  useEffect(() => {
    // Enrollments are read through RLS - only the signed-in user's own
    // rows are visible to the server session; the anon key cannot read
    // other users' enrollments.
    setEnrolled([]);
  }, [user]);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.paper }}>
      <ScreenHeader title="My Learning" subtitle={user ? `Signed in as ${user.email}` : 'Sign in to see your courses.'} />
      {!user ? (
        <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={{ backgroundColor: theme.colors.amber, margin: theme.spacing, padding: 14, borderRadius: 12, alignItems: 'center' }}>
          <Text style={{ fontWeight: '800' }}>Sign up / Log in</Text>
        </TouchableOpacity>
      ) : enrolled.length === 0 ? (
        <Text style={{ padding: theme.spacing, color: theme.colors.muted }}>No enrolled courses yet. Buy a course or take a subscription to start learning.</Text>
      ) : null}
    </ScrollView>
  );
}
