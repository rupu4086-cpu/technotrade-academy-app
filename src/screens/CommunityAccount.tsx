import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabase';
import { useAuth } from '../auth';
import { theme } from '../theme';
import { EmptyState, ScreenHeader } from '../components/ui';

export function CommunityScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  async function load() {
    const { data } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false }).limit(30);
    setPosts(data ?? []);
  }
  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  async function post() {
    if (!user) {
      setStatus('Sign in to post.');
      return;
    }
    if (!text.trim()) return;
    const { error } = await supabase.from('community_posts').insert({ user_id: user.id, content: text.trim(), category: 'Discussion' });
    if (error) setStatus(error.message);
    else {
      setText('');
      setStatus('Posted.');
      load().catch(() => undefined);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.paper }}>
      <ScreenHeader title="Community" subtitle="Only signed-in students can post." />
      <View style={{ padding: theme.spacing }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Share a question or a trade setup…"
          multiline
          style={{ borderWidth: 1, borderColor: theme.colors.line, borderRadius: 12, padding: 12, backgroundColor: theme.colors.card, minHeight: 80 }}
        />
        <TouchableOpacity onPress={post} style={{ backgroundColor: theme.colors.amber, padding: 12, borderRadius: 12, marginTop: 10, alignItems: 'center' }}>
          <Text style={{ fontWeight: '800' }}>Post</Text>
        </TouchableOpacity>
        {status ? <Text style={{ color: theme.colors.muted, marginTop: 8 }}>{status}</Text> : null}
      </View>
      {posts.length === 0 ? <EmptyState text="No community posts yet." /> : null}
      {posts.map((p) => (
        <View key={p.id} style={{ backgroundColor: theme.colors.card, margin: theme.spacing, marginTop: 0, padding: theme.spacing, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.colors.line }}>
          <Text style={{ color: theme.colors.ink }}>{p.content ?? p.title ?? ''}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export function AccountScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.paper }}>
      <ScreenHeader title="Account" subtitle={user ? user.email : 'Not signed in'} />
      <View style={{ padding: theme.spacing }}>
        {user ? (
          <>
            <Text style={{ color: theme.colors.ink }}>Subscription: check your plan and expiry in My Learning.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminNotifications')} style={{ backgroundColor: theme.colors.charcoal, padding: 14, borderRadius: 12, marginTop: 16, alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontWeight: '800' }}>Admin: Send notification</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut} style={{ padding: 14, alignItems: 'center', marginTop: 8 }}>
              <Text style={{ color: theme.colors.red, fontWeight: '700' }}>Log out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={{ backgroundColor: theme.colors.amber, padding: 14, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ fontWeight: '800' }}>Sign up / Log in</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
