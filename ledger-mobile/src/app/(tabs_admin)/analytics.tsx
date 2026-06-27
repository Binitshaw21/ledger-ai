import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(168,85,247,0.1)', 'transparent']} style={styles.glowTop} />
      
      <View style={styles.header}>
        <Text style={styles.title}>System Analytics</Text>
        <Text style={styles.subtitle}>Real-Time Metrics</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>ANOMALY DETECTIONS (LAST 6 MONTHS)</Text>
          <LineChart
            data={{
              labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
              datasets: [{ data: [12, 19, 15, 25, 32, 14] }]
            }}
            width={width - 80} // padding from container and card
            height={200}
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "rgba(8,6,20,0)",
              backgroundGradientTo: "rgba(8,6,20,0)",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.5})`,
              style: { borderRadius: 16 },
              propsForDots: { r: "4", strokeWidth: "2", stroke: "#a855f7" }
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>NODE TRAFFIC DISTRIBUTION</Text>
          <BarChart
            data={{
              labels: ["EU", "US-E", "APAC", "LATAM", "UK"],
              datasets: [{ data: [85, 92, 45, 30, 78] }]
            }}
            width={width - 80}
            height={200}
            yAxisLabel=""
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "rgba(8,6,20,0)",
              backgroundGradientTo: "rgba(8,6,20,0)",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 240, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.5})`,
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>
        
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
  content: { flex: 1 },
  chartCard: { 
    backgroundColor: 'rgba(8,6,20,0.8)', 
    borderWidth: 1, 
    borderColor: 'rgba(168,85,247,0.2)', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 24,
    alignItems: 'center'
  },
  chartTitle: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    alignSelf: 'flex-start',
    marginBottom: 10
  }
});
