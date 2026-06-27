import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const { height } = Dimensions.get('window');

export default function AdminSettingsScreen() {
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'feedback'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedback(data);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(0,240,255,0.1)', 'transparent']} style={styles.glowTop} />
      
      <View style={styles.header}>
        <Text style={styles.title}>System Settings</Text>
        <Text style={styles.subtitle}>Admin Preferences & Reports</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>User Feedback Reports ({feedback.length})</Text>
        
        {feedback.length === 0 ? (
          <Text style={styles.emptyText}>No feedback submitted yet.</Text>
        ) : (
          feedback.slice(0, 3).map((fb) => (
            <View key={fb.id} style={styles.feedbackCard}>
              <View style={styles.fbHeader}>
                <Text style={styles.fbSender}>{fb.sender || 'Unknown Officer'}</Text>
                <Text style={styles.fbDate}>{new Date(fb.date).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.fbMessage}>{fb.message}</Text>
            </View>
          ))
        )}

        {feedback.length > 3 && (
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>VIEW ALL FEEDBACK</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Preferences</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconBox}>
            <FontAwesome5 name="bell" size={16} color="#00f0ff" />
          </View>
          <Text style={styles.menuItemText}>Push Notifications</Text>
          <FontAwesome5 name="chevron-right" size={14} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconBox}>
            <FontAwesome5 name="shield-alt" size={16} color="#00f0ff" />
          </View>
          <Text style={styles.menuItemText}>Security & FHE Keys</Text>
          <FontAwesome5 name="chevron-right" size={14} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <FontAwesome5 name="power-off" size={16} color="#ef4444" />
          <Text style={styles.logoutBtnText}>DISCONNECT FROM SYSTEM</Text>
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
  subtitle: { fontSize: 10, color: 'rgba(0,240,255,0.7)', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },
  sectionTitle: { color: '#fff', fontSize: 12, fontWeight: '800', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', fontSize: 12, marginBottom: 20 },
  feedbackCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, marginBottom: 12 },
  fbHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  fbSender: { color: '#00f0ff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  fbDate: { color: 'rgba(255,255,255,0.3)', fontSize: 10 },
  fbMessage: { color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 18 },
  viewAllBtn: { alignItems: 'center', padding: 12, backgroundColor: 'rgba(0,240,255,0.05)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(0,240,255,0.2)', marginBottom: 20 },
  viewAllText: { color: '#00f0ff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(8,6,20,0.8)', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  menuIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(0,240,255,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuItemText: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', marginTop: 40 },
  logoutBtnText: { color: '#ef4444', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginLeft: 12 }
});
