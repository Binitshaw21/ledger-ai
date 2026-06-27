import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'audit_history'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(0,240,255,0.1)', 'transparent']} style={styles.glowTop} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Global Ledger</Text>
        <Text style={styles.subtitle}>Immutable Audit Trail</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#00f0ff" style={{ marginTop: 40 }} size="large" />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {history.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <FontAwesome5 
                  name={item.anomalies > 0 ? "exclamation-triangle" : "check-circle"} 
                  size={16} 
                  color={item.anomalies > 0 ? "#ef4444" : "#22c55e"} 
                />
                <Text style={styles.dateText}>
                  {new Date(item.date).toLocaleString()}
                </Text>
                <Text style={styles.sourceBadge}>{item.source || 'Web Dashboard'}</Text>
              </View>
              
              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>ROWS ANALYZED</Text>
                  <Text style={styles.metricValue}>{item.rows.toLocaleString()}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>ANOMALIES</Text>
                  <Text style={[styles.metricValue, { color: item.anomalies > 0 ? '#ef4444' : '#22c55e' }]}>
                    {item.anomalies.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>FL ROUND</Text>
                  <Text style={[styles.metricValue, { color: '#a855f7' }]}>#{item.fl_round}</Text>
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
  header: { marginBottom: 32, marginTop: 20, zIndex: 10 },
  title: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  subtitle: { fontSize: 10, color: 'rgba(0,240,255,0.7)', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },
  list: { flex: 1 },
  historyCard: {
    backgroundColor: 'rgba(8,6,20,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 12,
  },
  dateText: { color: '#fff', fontSize: 12, fontWeight: '700', marginLeft: 12, flex: 1 },
  sourceBadge: { color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { alignItems: 'flex-start' },
  metricLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 1, marginBottom: 4 },
  metricValue: { color: '#fff', fontSize: 16, fontWeight: '900' }
});
