import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabase';
import { useAuth } from '../auth';
import { theme } from '../theme';
import { ScreenHeader } from '../components/ui';

// Admin notifications - the OWNER sends push notifications himself.
// How sending works (see ADMIN_NOTIFICATIONS.md):
// 1. This screen saves the message into Supabase table `notifications`
//    (title, body, audience: 'all' | a user id, sent_at).
// 2. The admin server / Firebase Cloud Function reads that row and sends
//    it with FCM to the registered device tokens in `device_tokens`.
// 3. The Firebase server key / service account lives ONLY in the admin
//    server settings - never in this app, never in this file.
// If the server sender is not set up yet, the message is saved as
// "queued" and the screen says so plainly.
export function AdminNotificationsScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('all');
  const [status, setStatus] = useState('');

  async function send() {
    if (!title.trim() || !body.trim()) {
      setStatus('Enter a title and a message.');
      return;
    }
    const { error } = await supabase.from('notifications').insert({
      title: title.trim(),
      body: body.trim(),
      audience,
      created_by: user?.id ?? null,
      status: 'queued',
    });
    if (error) {
      setStatus(`Could not save: ${error.message}. The notifications table may not exist yet - see ADMIN_NOTIFICATIONS.md.`);
    } else {
      setStatus('Saved as queued. The admin server will send it with FCM to all registered devices. (If the FCM server sender is not set up yet, it stays queued.)');
      setTitle('');
      setBody('');
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.paper }}>
      <ScreenHeader title="Send notification" subtitle="Owner only. Sent to app users with Firebase Cloud Messaging." />
      <View style={{ padding: theme.spacing }}>
        <TextInput value={title} onChangeText={setTitle} placeholder="Notification title" style={{ borderWidth: 1, borderColor: theme.colors.line, borderRadius: 12, padding: 12, backgroundColor: theme.colors.card }} />
        <TextInput value={body} onChangeText={setBody} placeholder="Message for your students…" multiline style={{ borderWidth: 1, borderColor: theme.colors.line, borderRadius: 12, padding: 12, marginTop: 10, backgroundColor: theme.colors.card, minHeight: 90 }} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          {(['all', 'subscribed'] as const).map((a) => (
            <TouchableOpacity key={a} onPress={() => setAudience(a)} style={{ flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', backgroundColor: audience === a ? theme.colors.ink : theme.colors.card, borderWidth: 1, borderColor: theme.colors.line }}>
              <Text style={{ color: audience === a ? '#FFF' : theme.colors.ink, fontWeight: '700' }}>{a === 'all' ? 'All users' : 'Subscribed only'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {status ? <Text style={{ color: theme.colors.ink, marginTop: 12, lineHeight: 20 }}>{status}</Text> : null}
        <TouchableOpacity onPress={send} style={{ backgroundColor: theme.colors.amber, padding: 14, borderRadius: 12, marginTop: 16, alignItems: 'center' }}>
          <Text style={{ fontWeight: '800' }}>Send notification</Text>
        </TouchableOpacity>
        <Text style={{ color: theme.colors.muted, marginTop: 12, fontSize: 12 }}>
          Sending needs the Firebase server key in the admin server only. The app never holds it.
        </Text>
      </View>
    </ScrollView>
  );
}
