import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { collection, query, orderBy, limit, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function DashboardScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'audit_history'), orderBy('date', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRunAudit = async () => {
    try {
      await addDoc(collection(db, 'audit_history'), {
        date: new Date().toISOString(),
        rows: Math.floor(Math.random() * 5000) + 1000,
        anomalies: Math.floor(Math.random() * 10),
        fl_round: Math.floor(Math.random() * 900) + 100,
        source: 'Mobile App'
      });
      alert('Audit Simulation Complete! Check Web Dashboard.');
    } catch (error) {
      alert('Failed to run audit.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(0,240,255,0.1)', 'transparent']} style={styles.glowTop} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Threat Assessment</Text>
          <Text style={styles.subtitle}>Mobile Command Center</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.logoutWrapper}>
          <Text style={styles.logoutBtn}>DISCONNECT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionCard}>
        <LinearGradient colors={['rgba(168,85,247,0.15)', 'transparent']} style={StyleSheet.absoluteFillObject} />
        <Text style={styles.cardTitle}>Mobile Scanner</Text>
        <Text style={styles.cardDesc}>Upload receipts via camera or trigger a cloud audit simulation across the federated network.</Text>
        
        <TouchableOpacity onPress={handleRunAudit} style={{ overflow: 'hidden', borderRadius: 12 }}>
          <LinearGradient
            colors={['#00f0ff', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>RUN CLOUD AUDIT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Audits (Live Sync)</Text>
      
      {loading ? (
        <ActivityIndicator color="#00f0ff" style={{ marginTop: 40 }} size="large" />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {history.map((item, i) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <Text style={styles.historyDate}>{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                <Text style={styles.tag}>SYNCED</Text>
              </View>
              <View style={styles.historyStats}>
                <View>
                  <Text style={styles.statLabel}>Rows Scanned</Text>
                  <Text style={styles.statValue}>{item.rows.toLocaleString()}</Text>
                </View>
                <View>
                  <Text style={styles.statLabel}>Anomalies</Text>
                  <Text style={[styles.statValue, { color: '#ef4444' }]}>{item.anomalies}</Text>
                </View>
                <View>
                  <Text style={styles.statLabel}>FL Round</Text>
                  <Text style={[styles.statValue, { color: '#00f0ff' }]}>#{item.fl_round}</Text>
                </View>
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030108',
    padding: 24,
  },
  glowTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: height * 0.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    color: 'rgba(0,240,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  logoutWrapper: {
    padding: 8,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  logoutBtn: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  actionCard: {
    backgroundColor: 'rgba(8,6,20,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.3)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: {
    color: '#a855f7',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 1,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryBtn: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#000',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 13,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  list: {
    flex: 1,
  },
  historyCard: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  historyDate: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
    fontSize: 14,
  },
  tag: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    color: '#22c55e',
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    letterSpacing: 1,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  }
});
