import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { fetchCourseLessons, hasAccess, type Course, type Lesson } from '../supabase';
import { useAuth } from '../auth';
import { inr, theme } from '../theme';
import { ScreenHeader } from '../components/ui';

// Free users see thumbnail + title + price + description ONLY.
// Curriculum and lessons load only when the signed-in user owns the
// course (bought or subscribed). Everyone else sees the locked state.
export function CourseDetailScreen({ route, navigation }: any) {
  const course: Course = route.params.course;
  const { user } = useAuth();
  const [owned, setOwned] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (!user) return;
    hasAccess(user.id, course.id).then((ok) => {
      setOwned(ok);
      if (ok) fetchCourseLessons(course.id).then(setLessons).catch(() => undefined);
    });
  }, [user, course.id]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.paper }}>
      <View style={{ backgroundColor: theme.colors.line, height: 180, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 40, fontWeight: '800', color: theme.colors.charcoal }}>TT</Text>
        <Text style={{ color: theme.colors.muted }}>Course thumbnail</Text>
      </View>
      <ScreenHeader title={course.title} subtitle={`${course.category} · ${course.level}`} />
      <View style={{ padding: theme.spacing }}>
        <Text style={{ color: theme.colors.ink, lineHeight: 22 }}>{course.description}</Text>
        <Text style={{ color: theme.colors.amberDark, fontWeight: '800', fontSize: 20, marginTop: 12 }}>{inr(course.price_paise)}</Text>
        {!owned ? (
          <View style={{ backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.line, borderRadius: theme.radius, padding: theme.spacing, marginTop: 16 }}>
            <Text style={{ fontWeight: '800', color: theme.colors.ink }}>🔒 Full course is locked</Text>
            <Text style={{ color: theme.colors.muted, marginTop: 6 }}>
              Curriculum, lessons and videos unlock after you buy this course or take a subscription.
            </Text>
            <TouchableOpacity
              onPress={() => (user ? navigation.navigate('Checkout', { course }) : navigation.navigate('Auth'))}
              style={{ backgroundColor: theme.colors.amber, padding: 14, borderRadius: 12, marginTop: 12, alignItems: 'center' }}>
              <Text style={{ fontWeight: '800' }}>{user ? 'Buy now' : 'Sign up to buy'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Subscriptions')}
              style={{ padding: 12, alignItems: 'center', marginTop: 4 }}>
              <Text style={{ color: theme.colors.amberDark, fontWeight: '700' }}>Or see subscription plans</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: '800', fontSize: 18, color: theme.colors.ink }}>Curriculum</Text>
            {lessons.map((l) => (
              <View key={l.id} style={{ backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.line, borderRadius: 12, padding: 12, marginTop: 8 }}>
                <Text style={{ fontWeight: '700', color: theme.colors.ink }}>{l.title}</Text>
                <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{l.is_free_preview ? 'Free preview' : 'Enrolled'} · {l.duration_seconds ? `${Math.round(l.duration_seconds / 60)} min` : ''}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
