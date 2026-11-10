import React from 'react';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LandingScreen from '../screens/auth/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import useReducedMotion from '../hooks/useReducedMotion';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  const reducedMotion = useReducedMotion();
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
        animation: reducedMotion ? 'none' : 'default',
      }}
    >
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}
