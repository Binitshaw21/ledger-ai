import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(0,240,255,0.15)', 'transparent']} style={styles.glowTop} />
      <LinearGradient colors={['transparent', 'rgba(168,85,247,0.15)']} style={styles.glowBottom} />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>FHE ENABLED</Text>
        </View>
        
        <Text style={styles.brand}>LEDGER AI</Text>
        <Text style={styles.tagline}>Quantum-Ready Fraud Intelligence</Text>

        <Text style={styles.description}>
          Federated graph neural networks for enterprise-scale anomaly detection. Privacy-preserving audit trails built on Fully Homomorphic Encryption.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>NODES</Text>
            <Text style={styles.statValue}>4,201</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>EDGES</Text>
            <Text style={styles.statValue}>12.8K</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>FL ROUND</Text>
            <Text style={[styles.statValue, { color: '#00f0ff' }]}>#847</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push('/login')} style={{ overflow: 'hidden', borderRadius: 12, width: '100%', marginTop: 20 }}>
          <LinearGradient
            colors={['#00f0ff', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>ENTER PLATFORM</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>KPMG SECURE INFRASTRUCTURE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030108',
    justifyContent: 'center',
    padding: 30,
  },
  glowTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: height * 0.4,
  },
  glowBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0, height: height * 0.4,
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  badge: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: '#00f0ff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  brand: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#00f0ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 4,
    marginBottom: 8,
  },
  tagline: {
    color: '#00f0ff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  description: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
    backgroundColor: 'rgba(8, 6, 20, 0.75)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 6,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  primaryBtn: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
  }
});
