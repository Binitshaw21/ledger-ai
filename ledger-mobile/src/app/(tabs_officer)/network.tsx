import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const nodes = [
  { id: 'LDG-EU-01', location: 'Frankfurt, DE', type: 'FHE Aggregator', status: 'ONLINE', ping: '12ms' },
  { id: 'LDG-US-EAST', location: 'Virginia, US', type: 'GNN Compute', status: 'ONLINE', ping: '45ms' },
  { id: 'LDG-APAC-02', location: 'Singapore', type: 'Edge Validation', status: 'ONLINE', ping: '112ms' },
  { id: 'LDG-LATAM-01', location: 'São Paulo, BR', type: 'GNN Compute', status: 'SYNCING', ping: '180ms' },
  { id: 'LDG-UK-04', location: 'London, UK', type: 'FHE Aggregator', status: 'ONLINE', ping: '18ms' },
];

export default function NetworkScreen() {
  const [activeNodes, setActiveNodes] = useState(nodes);

  // Simulate ping fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNodes(prev => prev.map(n => {
        if (n.status === 'SYNCING') return n;
        const currentPing = parseInt(n.ping);
        const fluctuation = Math.floor(Math.random() * 10) - 5;
        return { ...n, ping: `${Math.max(1, currentPing + fluctuation)}ms` };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(34,197,94,0.1)', 'transparent']} style={styles.glowTop} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Global Network</Text>
        <Text style={styles.subtitle}>Federated Learning Topology</Text>
      </View>

      <View style={styles.summaryCard}>
        <LinearGradient colors={['rgba(8,6,20,0.8)', 'transparent']} style={StyleSheet.absoluteFillObject} />
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>NETWORK HEALTH</Text>
            <Text style={styles.summaryValue}>99.98%</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.summaryLabel}>ACTIVE NODES</Text>
            <Text style={[styles.summaryValue, { color: '#00f0ff' }]}>5 / 5</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>FHE ENCRYPTION</Text>
            <Text style={[styles.summaryValue, { color: '#22c55e' }]}>SECURE</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.summaryLabel}>AVG LATENCY</Text>
            <Text style={styles.summaryValue}>73ms</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Node Status</Text>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {activeNodes.map((node, i) => (
          <View key={node.id} style={styles.nodeCard}>
            <View style={styles.nodeHeader}>
              <View style={styles.nodeIcon}>
                <FontAwesome5 name="server" size={16} color={node.status === 'ONLINE' ? '#22c55e' : '#f59e0b'} />
              </View>
              <View style={styles.nodeInfo}>
                <Text style={styles.nodeId}>{node.id}</Text>
                <Text style={styles.nodeLocation}>{node.location}</Text>
              </View>
              <View style={styles.nodeStatusBox}>
                <Text style={[styles.nodeStatus, { color: node.status === 'ONLINE' ? '#22c55e' : '#f59e0b' }]}>
                  {node.status}
                </Text>
                <Text style={styles.nodePing}>{node.ping}</Text>
              </View>
            </View>
            
            <View style={styles.nodeFooter}>
              <Text style={styles.nodeType}>{node.type}</Text>
              <Text style={styles.nodeDetail}>Homomorphic Keys: Syncing...</Text>
            </View>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
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
    color: 'rgba(34,197,94,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
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
  nodeCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  nodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nodeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  nodeInfo: {
    flex: 1,
  },
  nodeId: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  nodeLocation: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 2,
  },
  nodeStatusBox: {
    alignItems: 'flex-end',
  },
  nodeStatus: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  nodePing: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  nodeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  nodeType: {
    color: '#a855f7',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  nodeDetail: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 9,
  }
});
