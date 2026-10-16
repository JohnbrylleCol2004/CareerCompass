import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthNavigator from './src/navigation/AuthNavigator';
import StudentNavigator from './src/navigation/StudentNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { NetworkProvider } from './src/context/NetworkContext';
import OfflineNotice from './src/components/OfflineNotice';
import { colors } from './src/theme/colors';

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background }}><ActivityIndicator color={colors.primaryDark} /></View>;
  }

  if (!user) {
    return <AuthNavigator />;
  }
  return <StudentNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NetworkProvider>
      <AuthProvider>
        <View style={{ flex: 1 }}>
        <OfflineNotice />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        </View>
      </AuthProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}
