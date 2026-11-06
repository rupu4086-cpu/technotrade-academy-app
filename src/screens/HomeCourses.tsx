import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { fetchPublishedCourses, type Course } from '../supabase';
import { inr, theme } from '../theme';
import { EmptyState, ScreenHeader } from '../components/ui';

export function HomeScreen({ navigation }: any) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPublishedCourses()
      .then((c) => setCourses(c.slice(0, 3)))
      .catch(() => setError('Courses could not be loaded. Check your connection.'));
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.paper }}>
      <View style={{ backgroundColor: theme.colors.charcoal, padding: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <Text style={{ color: theme.colors.amber, fontWeight: '800', fontSize: 13 }}>TECHNOTRADE ACADEMY</Text>
        <Text style={{ color: '#FFF', fontSize: 28, fontWeight: '800', marginTop: 8 }}>Learn trading.{'\n'}Trade with a plan.</Text>
        <Text style={{ color: '#D8D2C4', marginTop: 8 }}>Stock Market, Crypto and Forex - step by step, in plain language.</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Courses')}
          style={{ backgroundColor: theme.colors.amber, padding: 14, borderRadius: 12, marginTop: 16, alignItems: 'center' }}>
          <Text style={{ fontWeight: '800', color: theme.colors.ink }}>Browse courses</Text>
        </TouchableOpacity>
      </View>
      <ScreenHeader title="Featured courses" subtitle="Free users see the thumbnail, title, price and description. Buy to unlock the full course." />
      {error ? <Text style={{ color: theme.colors.red, padding: theme.spacing }}>{error}</Text> : null}
      {courses.length === 0 && !error ? <EmptyState text="Courses coming soon." /> : null}
      {courses.map((c) => (
        <TouchableOpacity
          key={c.id}
          onPress={() => navigation.navigate('CourseDetail', { course: c })}
          style={{ backgroundColor: theme.colors.card, margin: theme.spacing, marginTop: 8, padding: theme.spacing, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.colors.line }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: theme.colors.ink }}>{c.title}</Text>
          <Text style={{ color: theme.colors.muted, marginTop: 4 }} numberOfLines={2}>{c.description}</Text>
          <Text style={{ color: theme.colors.amberDark, fontWeight: '800', marginTop: 8 }}>{inr(c.price_paise)} · {c.level}</Text>
        </TouchableOpacity>
      ))}
      <View style={{ padding: theme.spacing }}>
        <Text style={{ color: theme.colors.muted, fontSize: 12 }}>Educational content only. Trading involves risk - no profit is guaranteed.</Text>
      </View>
    </ScrollView>
  );
}

export function CoursesScreen({ navigation }: any) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPublishedCourses()
      .then(setCourses)
      .catch(() => setError('Courses could not be loaded.'));
  }, []);

  const filters = ['All', 'Stock Market', 'Crypto', 'Forex', 'Psychology', 'Advanced'];
  const shown = filter === 'All' ? courses : courses.filter((c) => c.category === filter);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.paper }}>
      <ScreenHeader title="Courses" subtitle="Thumbnail, title, price and description are free to see. Detail unlocks after buying." />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, paddingHorizontal: theme.spacing }}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={{ backgroundColor: filter === f ? theme.colors.ink : theme.colors.card, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: theme.colors.line }}>
            <Text style={{ color: filter === f ? '#FFF' : theme.colors.ink, fontWeight: '700' }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {error ? <Text style={{ color: theme.colors.red, padding: theme.spacing }}>{error}</Text> : null}
      <FlatList
        data={shown}
        keyExtractor={(c) => c.id}
        ListEmptyComponent={<EmptyState text={error ? '' : 'Courses coming soon.'} />}
        renderItem={({ item: c }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('CourseDetail', { course: c })}
            style={{ backgroundColor: theme.colors.card, margin: theme.spacing, marginTop: 8, padding: theme.spacing, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.colors.line }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: theme.colors.ink }}>{c.title}</Text>
            <Text style={{ color: theme.colors.muted, marginTop: 4 }} numberOfLines={2}>{c.description}</Text>
            <Text style={{ color: theme.colors.amberDark, fontWeight: '800', marginTop: 8 }}>{inr(c.price_paise)} · {c.level} · {c.category}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
