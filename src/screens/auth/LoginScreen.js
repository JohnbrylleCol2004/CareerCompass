import { useAuth } from '../../context/AuthContext';
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../../components/PrimaryButton';
import PasswordInput from '../../components/PasswordInput';
import { colors } from '../../theme/colors';
import { useNetwork } from '../../context/NetworkContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { requireConnection } = useNetwork();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
  if (loading || !requireConnection()) return;
  if (!email || !password) {
    Alert.alert(
      'Missing Information',
      'Please enter your email and password.'
    );
    return;
  }

  try {
    setLoading(true);
    await login(email, password);
  } catch (error) {
    Alert.alert('Login Failed', error.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Login</Text>

        <Text style={styles.subtitle}>
          Access your Career Compass account
        </Text>

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor={colors.gray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Email address"
          editable={!loading}
        />

        <Text style={styles.label}>Password</Text>
        <PasswordInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword', { email: email.trim() })}
          accessibilityRole="button"
          style={styles.linkButton}
        >
          <Text style={styles.forgotPassword}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Login"
          onPress={handleLogin}
          loading={loading}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          accessibilityRole="button"
          accessibilityLabel="Register for an account"
          style={styles.registerPrompt}
        >
          <Text style={styles.normalText}>
            Do not have an account? <Text style={styles.link}>Register</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          style={styles.linkButton}
        >
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28,
  },
  keyboardView: { flex: 1 },
  linkButton: { minHeight: 44, justifyContent: 'center' },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.gray,
    marginBottom: 30,
  },
  label: {
    color: colors.dark,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    color: colors.dark,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 13,
    minHeight: 50,
    fontSize: 15,
  },
  forgotPassword: {
    textAlign: 'right',
    color: colors.primaryDark,
    marginTop: 12,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  registerPrompt: {
    minHeight: 48,
    justifyContent: 'center',
    marginTop: 12,
  },
  normalText: {
    color: colors.gray,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  link: {
    color: colors.primaryDark,
    fontWeight: 'bold',
  },
  back: {
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: 22,
    fontWeight: 'bold',
  },
});
