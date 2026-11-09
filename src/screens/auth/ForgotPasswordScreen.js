import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

export default function ForgotPasswordScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Password reset unavailable</Text>

        <Text style={styles.description}>
          Password reset is not set up yet. No reset email will be sent from this version.
        </Text>

        <PrimaryButton
          title="Back to Login"
          variant="secondary"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    textAlign: 'center',
    color: colors.gray,
    lineHeight: 22,
    marginBottom: 28,
  },
});
