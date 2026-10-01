import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import CareerProfilesScreen from '../screens/admin/CareerProfilesScreen';
import SkillRequirementsScreen from '../screens/admin/SkillRequirementsScreen';
import SpecializationsScreen from '../screens/admin/SpecializationsScreen';
import ElectiveMappingsScreen from '../screens/admin/ElectiveMappingsScreen';

import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'grid-outline';

          if (route.name === 'Admin Dashboard') {
            iconName = 'grid-outline';
          } else if (route.name === 'Careers') {
            iconName = 'briefcase-outline';
          } else if (route.name === 'Skills') {
            iconName = 'bar-chart-outline';
          } else if (route.name === 'Electives') {
            iconName = 'book-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Admin Dashboard"
        component={AdminDashboardScreen}
      />

      <Tab.Screen
        name="Careers"
        component={CareerProfilesScreen}
      />

      <Tab.Screen
        name="Skills"
        component={SkillRequirementsScreen}
      />

      <Tab.Screen
        name="Electives"
        component={ElectiveMappingsScreen}
      />
    </Tab.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Specializations"
        component={SpecializationsScreen}
        options={{ title: 'Specializations' }}
      />
    </Stack.Navigator>
  );
}
