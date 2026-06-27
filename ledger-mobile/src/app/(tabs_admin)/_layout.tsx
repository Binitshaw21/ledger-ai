import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Dimensions, View } from 'react-native';

export default function AdminTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(8, 6, 20, 0.9)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 240, 255, 0.3)', // Cyan for admin
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
          title: 'USERS',
          tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'ANALYTICS',
          tabBarIcon: ({ color }) => <FontAwesome5 name="chart-bar" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SETTINGS',
          tabBarIcon: ({ color }) => <FontAwesome5 name="cog" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
