import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import CareerProfilesScreen from '../screens/admin/CareerProfilesScreen';
import SkillRequirementsScreen from '../screens/admin/SkillRequirementsScreen';
import SpecializationsScreen from '../screens/admin/SpecializationsScreen';
import ElectiveMappingsScreen from '../screens/admin/ElectiveMappingsScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Admin Dashboard',
        }}
      />

      <Stack.Screen
        name="CareerProfiles"
        component={CareerProfilesScreen}
        options={{
          title: 'Career Profiles',
        }}
      />

      <Stack.Screen
        name="SkillRequirements"
        component={SkillRequirementsScreen}
        options={{
          title: 'Skill Requirements',
        }}
      />

      <Stack.Screen
        name="Specializations"
        component={SpecializationsScreen}
        options={{
          title: 'Specializations',
        }}
      />

      <Stack.Screen
        name="ElectiveMappings"
        component={ElectiveMappingsScreen}
        options={{
          title: 'Elective Mappings',
        }}
      />
    </Stack.Navigator>
  );
}