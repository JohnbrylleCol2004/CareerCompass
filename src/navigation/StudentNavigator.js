import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import useReducedMotion from '../hooks/useReducedMotion';

import DashboardScreen from '../screens/student/DashboardScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import EditProfileScreen from '../screens/student/EditProfileScreen';
import SkillGapScreen from '../screens/student/SkillGapScreen';
import ElectiveRecommendationScreen from '../screens/student/ElectiveRecommendationScreen';
import CareerRecommendationScreen from '../screens/student/CareerRecommendationScreen';
import InterviewCoachScreen from '../screens/student/InterviewCoachScreen';
import ResumeAnalyzerScreen from '../screens/student/ResumeAnalyzerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StudentTabs() {
  const reducedMotion = useReducedMotion();
  return (
    <Tab.Navigator
      backBehavior="firstRoute"
      tabBar={() => null}
      screenOptions={{
        headerShown: false,
        animation: reducedMotion ? 'none' : 'fade',
        transitionSpec: { animation: 'timing', config: { duration: 170 } },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Skill Gap" component={SkillGapScreen} />
      <Tab.Screen name="Careers" component={CareerRecommendationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function StudentNavigator() {
  const reducedMotion = useReducedMotion();
  return (
    <Stack.Navigator screenOptions={{ animation: reducedMotion ? 'none' : 'default' }}>
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
