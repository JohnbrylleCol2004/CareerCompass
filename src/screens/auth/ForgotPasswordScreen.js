import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { requestPasswordReset } from '../../services/passwordResetService';
import { useNetwork } from '../../context/NetworkContext';

export default function ForgotPasswordScreen({ navigation, route }) {
  const { requireConnection } = useNetwork();
  const [email, setEmail] = useState(route?.params?.email || '');
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const coolingDown = cooldown > 0;
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (!coolingDown) return;
    const timer = setInterval(() => setCooldown(seconds => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(timer);
  }, [coolingDown]);

  async function sendResetEmail() {
    if (busy.current || coolingDown || !requireConnection()) return;
    busy.current = true;
    setLoading(true);
    setError('');
    setSentTo('');
    try {
      await requestPasswordReset(email);
      if (!mounted.current) return;
      setSentTo(email.trim().toLowerCase());
      setCooldown(60);
    } catch (failure) {
      if (mounted.current) setError(failure?.message || 'Unable to send a reset email. Please try again.');
    } finally {
      busy.current = false;
      if (mounted.current) setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Forgot Password?</Text>

        <Text style={styles.description}>
          Enter the email address registered to your account. We’ll send a secure link to choose a new password.
        </Text>
        <Text style={styles.label}>Registered Email Address</Text>
        <TextInput style={styles.input} accessibilityLabel="Registered email address"
          placeholder="Enter your registered email" placeholderTextColor={colors.gray}
          value={email} onChangeText={value => { setEmail(value); setError(''); setSentTo(''); }}
          keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
          autoComplete="email" editable={!loading} returnKeyType="send" onSubmitEditing={sendResetEmail} />
        {!!error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
        {!!sentTo && <Text style={styles.success} accessibilityLiveRegion="polite">
          If an account is registered with {sentTo}, a password-reset link will be sent. Check your inbox and spam folder. Open the link to set a new password on the Career Compass website, then return to this app to log in.
        </Text>}
        <PrimaryButton title={coolingDown ? `Send again in ${cooldown}s` : 'Send Reset Email'}
          onPress={sendResetEmail} loading={loading} disabled={coolingDown || !email.trim()} />

        <PrimaryButton
          title="Back to Login"
          variant="secondary"
          disabled={loading}
          onPress={() => navigation.navigate('Login')}
        />
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
  label: { color: colors.dark, fontWeight: 'bold', marginBottom: 8 },
  input: { color: colors.dark, backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 8, padding: 13, minHeight: 50, fontSize: 15, marginBottom: 12 },
  error: { color: colors.danger, lineHeight: 22, marginBottom: 12 },
  success: { color: colors.primaryDark, backgroundColor: colors.secondary, padding: 16, borderRadius: 12, lineHeight: 22, marginBottom: 12 },
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
