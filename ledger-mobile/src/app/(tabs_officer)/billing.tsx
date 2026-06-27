import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const { height } = Dimensions.get('window');

export default function BillingScreen() {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    // Simulate Razorpay Gateway Delay
    setTimeout(async () => {
      try {
        await addDoc(collection(db, 'audit_history'), {
          date: new Date().toISOString(),
          rows: 0,
          anomalies: 0,
          fl_round: 0,
          source: 'Mobile App - Subscription Upgrade'
        });
      } catch (e) {
        console.error(e);
      }
      setProcessing(false);
      setSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(245,158,11,0.1)', 'transparent']} style={styles.glowTop} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Enterprise Billing</Text>
        <Text style={styles.subtitle}>Manage Subscriptions</Text>
      </View>

      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <Text style={styles.planName}>ENTERPRISE AI</Text>
          <Text style={styles.planPrice}>$9,999<Text style={styles.perMonth}>/mo</Text></Text>
        </View>

        <View style={styles.features}>
          <Text style={styles.featureItem}>✓ Unlimited FL Nodes</Text>
          <Text style={styles.featureItem}>✓ Quantum-Ready FHE</Text>
          <Text style={styles.featureItem}>✓ Real-Time Fraud Sync</Text>
        </View>

        {success ? (
          <View style={styles.successBox}>
            <FontAwesome5 name="check-circle" size={32} color="#22c55e" />
            <Text style={styles.successText}>PAYMENT SUCCESSFUL</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={handlePayment} disabled={processing} style={{ overflow: 'hidden', borderRadius: 12 }}>
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.payBtn}
            >
              {processing ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.payBtnText}>UPGRADE PLAN WITH RAZORPAY</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.disclaimer}>
        * This is a secure mock transaction designed for Demo & Hackathon purposes. It syncs to Firebase to prove real-time dashboard updates.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030108', padding: 24 },
  glowTop: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.3 },
  header: { marginBottom: 32, marginTop: 20, zIndex: 10 },
  title: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  subtitle: { fontSize: 10, color: 'rgba(245,158,11,0.7)', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },
  planCard: {
    backgroundColor: 'rgba(8,6,20,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 20,
    padding: 24,
  },
  planHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 20,
    marginBottom: 20,
  },
  planName: { color: '#f59e0b', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  planPrice: { color: '#fff', fontSize: 36, fontWeight: '900' },
  perMonth: { fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  features: { marginBottom: 30 },
  featureItem: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 12, fontWeight: '600' },
  payBtn: { padding: 18, alignItems: 'center', justifyContent: 'center' },
  payBtnText: { color: '#000', fontWeight: '900', letterSpacing: 1, fontSize: 14 },
  successBox: { alignItems: 'center', padding: 16, backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)' },
  successText: { color: '#22c55e', marginTop: 8, fontWeight: '900', letterSpacing: 1 },
  disclaimer: { color: 'rgba(255,255,255,0.3)', fontSize: 10, textAlign: 'center', marginTop: 40, lineHeight: 16 }
});
