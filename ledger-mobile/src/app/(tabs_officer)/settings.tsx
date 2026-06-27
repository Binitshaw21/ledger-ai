import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const { height } = Dimensions.get('window');

export default function OfficerSettingsScreen() {
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleLogout = () => {
    router.replace('/login');
  };

  const submitFeedback = async () => {
    if (!feedback.trim()) return;
    setSending(true);
    
    try {
      await addDoc(collection(db, 'feedback'), {
        message: feedback,
        sender: 'Field Officer Mobile',
        date: new Date().toISOString()
      });
      setSent(true);
      setFeedback('');
      setTimeout(() => setSent(false), 3000);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(168,85,247,0.1)', 'transparent']} style={styles.glowTop} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Command Profile</Text>
        <Text style={styles.subtitle}>Settings & Support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Submit Field Report / Feedback</Text>
        <View style={styles.feedbackContainer}>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Describe any issues or feature requests..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
          />
          {sent ? (
            <View style={styles.successBox}>
              <FontAwesome5 name="check" size={12} color="#22c55e" />
              <Text style={styles.successText}>REPORT TRANSMITTED</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={submitFeedback} disabled={sending || !feedback.trim()} style={[styles.submitBtn, !feedback.trim() && { opacity: 0.5 }]}>
              {sending ? <ActivityIndicator color="#000" size="small" /> : <Text style={styles.submitBtnText}>SEND TO ADMIN</Text>}
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Help & Support</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
            <FontAwesome5 name="book" size={16} color="#22c55e" />
          </View>
          <Text style={styles.menuItemText}>Standard Operating Procedures (FAQ)</Text>
          <FontAwesome5 name="chevron-right" size={14} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIconBox, { backgroundColor: 'rgba(236,72,153,0.1)' }]}>
            <FontAwesome5 name="headset" size={16} color="#ec4899" />
          </View>
          <Text style={styles.menuItemText}>Contact IT Support</Text>
          <FontAwesome5 name="chevron-right" size={14} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <FontAwesome5 name="power-off" size={16} color="#ef4444" />
          <Text style={styles.logoutBtnText}>DISCONNECT NODE (LOGOUT)</Text>
        </TouchableOpacity>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030108', padding: 24 },
  glowTop: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.3 },
  header: { marginBottom: 32, marginTop: 20, zIndex: 10 },
  title: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  subtitle: { fontSize: 10, color: 'rgba(168,85,247,0.7)', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },
  sectionTitle: { color: '#fff', fontSize: 12, fontWeight: '800', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' },
  feedbackContainer: { backgroundColor: 'rgba(8,6,20,0.8)', borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)', borderRadius: 16, padding: 16 },
  feedbackInput: { color: '#fff', fontSize: 14, minHeight: 80, textAlignVertical: 'top', marginBottom: 16 },
  submitBtn: { backgroundColor: '#a855f7', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#000', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  successBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(34,197,94,0.1)', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)' },
  successText: { color: '#22c55e', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginLeft: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(8,6,20,0.8)', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  menuIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuItemText: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', marginTop: 40 },
  logoutBtnText: { color: '#ef4444', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginLeft: 12 }
});
