import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(8, 6, 20, 0.9)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(168, 85, 247, 0.3)',
          elevation: 0,
          height: 70,
          paddingBottom: 12,
          paddingTop: 12,
          position: 'absolute',
        },
        tabBarActiveTintColor: '#00f0ff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.3)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 1,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'HUB',
          tabBarIcon: ({ color }) => <FontAwesome5 name="chart-pie" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'SCANNER',
          tabBarIcon: ({ color }) => <FontAwesome5 name="camera" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'NODES',
          tabBarIcon: ({ color }) => <FontAwesome5 name="project-diagram" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'HISTORY',
          tabBarIcon: ({ color }) => <FontAwesome5 name="history" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="billing"
        options={{
          title: 'UPGRADE',
          tabBarIcon: ({ color }) => <FontAwesome5 name="gem" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-cog" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
