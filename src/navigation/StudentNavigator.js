import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/student/DashboardScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import EditProfileScreen from '../screens/student/EditProfileScreen';
import SkillGapScreen from '../screens/student/SkillGapScreen';
import ElectiveRecommendationScreen from '../screens/student/ElectiveRecommendationScreen';
import CareerRecommendationScreen from '../screens/student/CareerRecommendationScreen';
import InterviewCoachScreen from '../screens/student/InterviewCoachScreen';
import ResumeAnalyzerScreen from '../screens/student/ResumeAnalyzerScreen';

import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StudentTabs() {
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
          backgroundColor: colors.white,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home-outline';

          if (route.name === 'Dashboard') {
            iconName = 'home-outline';
          } else if (route.name === 'Skill Gap') {
            iconName = 'analytics-outline';
          } else if (route.name === 'Careers') {
            iconName = 'briefcase-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
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
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Skill Gap" component={SkillGapScreen} />
      <Tab.Screen name="Careers" component={CareerRecommendationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function StudentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StudentTabs"
        component={StudentTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />

      <Stack.Screen
        name="ElectiveRecommendations"
        component={ElectiveRecommendationScreen}
        options={{ title: 'Elective Recommendations' }}
      />

      <Stack.Screen
        name="InterviewCoach"
        component={InterviewCoachScreen}
        options={{ title: 'Interview Coach' }}
      />

      <Stack.Screen
        name="ResumeAnalyzer"
        component={ResumeAnalyzerScreen}
        options={{ title: 'Resume Analyzer' }}
      />
    </Stack.Navigator>
  );
}