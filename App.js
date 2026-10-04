import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './src/navigation/AuthNavigator';
import StudentNavigator from './src/navigation/StudentNavigator';S
import { AuthProvider, useAuth } from './src/context/AuthContext';

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <AuthNavigator />;
  }
  return <StudentNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}