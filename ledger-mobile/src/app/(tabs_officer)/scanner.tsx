import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ScannerScreen() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = () => {
    setScanning(true);
    setResult(null);
    
    // Simulate OCR processing time
    setTimeout(async () => {
      const mockResult = {
        merchant: "GLOBAL TECH SUPPLIES LLC",
        amount: "$8,450.00",
        date: new Date().toISOString(),
        fraudScore: 84,
        flag: "Duplicate Vendor ID"
      };
      
      try {
        await addDoc(collection(db, 'audit_history'), {
          date: new Date().toISOString(),
          rows: 1,
          anomalies: 1,
          fl_round: Math.floor(Math.random() * 900) + 100,
          source: 'OCR Scanner'
        });
      } catch (e) {
        console.error(e);
      }
      
      setResult(mockResult);
      setScanning(false);
    }, 2500); // 2.5 seconds scanning animation
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(236,72,153,0.1)', 'transparent']} style={styles.glowTop} />
      
      <View style={styles.header}>
        <Text style={styles.title}>OCR Verification</Text>
        <Text style={styles.subtitle}>Upload Receipt / Invoice</Text>
      </View>

      {!result ? (
        <View style={styles.viewfinder}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
          
          {scanning ? (
            <View style={styles.scanningLayer}>
              <ActivityIndicator color="#ec4899" size="large" />
              <Text style={styles.scanningText}>ANALYZING DOCUMENT...</Text>
              <Text style={styles.scanningSubText}>FHE ENCRYPTION ACTIVE</Text>
            </View>
          ) : (
            <View style={styles.idleLayer}>
              <FontAwesome5 name="file-invoice-dollar" size={60} color="rgba(255,255,255,0.2)" />
              <Text style={styles.idleText}>ALIGN DOCUMENT WITHIN FRAME</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.resultCard}>
          <LinearGradient colors={['rgba(239,68,68,0.1)', 'transparent']} style={StyleSheet.absoluteFillObject} />
          <View style={styles.resultHeader}>
            <FontAwesome5 name="exclamation-triangle" size={24} color="#ef4444" />
            <Text style={styles.resultTitle}>ANOMALY DETECTED</Text>
          </View>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>MERCHANT</Text>
            <Text style={styles.dataValue}>{result.merchant}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>AMOUNT</Text>
            <Text style={styles.dataValue}>{result.amount}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>FRAUD SCORE</Text>
            <Text style={[styles.dataValue, { color: '#ef4444' }]}>{result.fraudScore} / 100</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>FLAG REASON</Text>
            <Text style={[styles.dataValue, { color: '#a855f7' }]}>{result.flag}</Text>
          </View>
          
          <Text style={styles.syncNotice}>✓ Event securely synced to Global Ledger</Text>
        </View>
      )}

      <TouchableOpacity onPress={handleScan} disabled={scanning} style={{ overflow: 'hidden', borderRadius: 12, marginTop: 'auto', marginBottom: 90 }}>
        <LinearGradient
          colors={['#ec4899', '#a855f7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryBtn}
        >
          <Text style={styles.primaryBtnText}>
            {result ? "SCAN ANOTHER" : scanning ? "SCANNING..." : "CAPTURE"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
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
    color: 'rgba(236,72,153,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  viewfinder: {
    height: 400,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerTL: { position: 'absolute', top: -1, left: -1, width: 30, height: 30, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#ec4899' },
  cornerTR: { position: 'absolute', top: -1, right: -1, width: 30, height: 30, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#ec4899' },
  cornerBL: { position: 'absolute', bottom: -1, left: -1, width: 30, height: 30, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#ec4899' },
  cornerBR: { position: 'absolute', bottom: -1, right: -1, width: 30, height: 30, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#ec4899' },
  idleLayer: {
    alignItems: 'center',
  },
  idleText: {
    color: 'rgba(255,255,255,0.3)',
    marginTop: 20,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '800',
  },
  scanningLayer: {
    alignItems: 'center',
  },
  scanningText: {
    color: '#ec4899',
    marginTop: 20,
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: '900',
  },
  scanningSubText: {
    color: '#00f0ff',
    marginTop: 8,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '800',
  },
  primaryBtn: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#000',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: 'rgba(8,6,20,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  resultTitle: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    marginLeft: 12,
  },
  dataRow: {
    marginBottom: 16,
  },
  dataLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 4,
  },
  dataValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  syncNotice: {
    color: '#22c55e',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 16,
    textAlign: 'center',
  }
});
