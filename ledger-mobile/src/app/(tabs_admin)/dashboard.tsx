import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

export default function AdminDashboardScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('registered', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(0,240,255,0.1)', 'transparent']} style={styles.glowTop} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Global Admin Console</Text>
          <Text style={styles.subtitle}>Access Management</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.logoutWrapper}>
          <Text style={styles.logoutBtn}>DISCONNECT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{users.length}</Text>
          <Text style={styles.statLabel}>TOTAL USERS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: '#22c55e' }]}>{users.filter(u => u.status === 'Active').length}</Text>
          <Text style={styles.statLabel}>ACTIVE</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: '#ef4444' }]}>{users.filter(u => u.status !== 'Active').length}</Text>
          <Text style={styles.statLabel}>REVOKED</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>User Access Database</Text>
      
      {loading ? (
        <ActivityIndicator color="#00f0ff" style={{ marginTop: 40 }} size="large" />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name || 'Unknown User'}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <View style={styles.statusBox}>
                  <Text style={[styles.statusText, { color: user.status === 'Active' ? '#22c55e' : '#ef4444' }]}>
                    {user.status || 'Active'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.userFooter}>
                <View>
                  <Text style={styles.detailLabel}>ROLE</Text>
                  <Text style={styles.detailValue}>{user.role}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.detailLabel}>LAST LOGIN</Text>
                  <Text style={styles.detailValue}>
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030108', padding: 24 },
  glowTop: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.3 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, marginTop: 20, zIndex: 10 },
  title: { fontSize: 22, fontWeight: '900', color: '#00f0ff', letterSpacing: 1 },
  subtitle: { fontSize: 10, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },
  logoutWrapper: { padding: 8, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  logoutBtn: { color: '#ef4444', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  statsCard: { flexDirection: 'row', backgroundColor: 'rgba(8,6,20,0.8)', borderWidth: 1, borderColor: 'rgba(0,240,255,0.3)', borderRadius: 16, padding: 20, marginBottom: 32 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '900', color: '#fff' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: 1 },
  sectionTitle: { color: '#fff', fontSize: 14, fontWeight: '800', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' },
  list: { flex: 1 },
  userCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 12 },
  userHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,240,255,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { color: '#00f0ff', fontSize: 18, fontWeight: '900' },
  userInfo: { flex: 1 },
  userName: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  userEmail: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 },
  statusBox: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.05)' },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  userFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  detailLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: 1, marginBottom: 4 },
  detailValue: { color: '#fff', fontSize: 12, fontWeight: '700' }
});
