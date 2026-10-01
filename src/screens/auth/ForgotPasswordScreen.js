import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  function handleReset() {
    if (!email) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }

    Alert.alert(
      'Reset Link Sent',
      'A password reset link would be sent to your email.'
    );

    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>

        <Text style={styles.description}>
          Enter your registered email address to reset your password.
        </Text>

        <Text style={styles.label}>Email Address</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PrimaryButton
          title="Send Reset Link"
          onPress={handleReset}
        />

        <PrimaryButton
          title="Back to Login"
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
  label: {
    color: colors.dark,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 13,
    fontSize: 15,
    marginBottom: 15,
  },
});