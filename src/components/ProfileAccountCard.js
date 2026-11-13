import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ProfilePhoto from './ProfilePhoto';
import PrimaryButton from './PrimaryButton';
import { getAccountEmail, requestEmailChange } from '../services/profileAccountService';
import { useNetwork } from '../context/NetworkContext';
import { colors } from '../theme/colors';

export default function ProfileAccountCard({ studentId, disabled, onBusyChange, onEmailFocus, onEmailLayout }) {
  const { requireConnection } = useNetwork();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nextEmail, setNextEmail] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const sendingRef = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => { onBusyChange(sending || photoBusy); return () => onBusyChange(false); }, [sending, photoBusy, onBusyChange]);
  const refreshEmail = useCallback(async () => {
    try {
      const current = await getAccountEmail();
      if (!mounted.current) return;
      setEmail(current);
      setEmailError('');
      setPendingEmail(previous => previous.toLowerCase() === current.toLowerCase() ? '' : previous);
    } catch (error) {
      if (mounted.current) setEmailError(error.message || 'Unable to load account email.');
    }
  }, []);
  useFocusEffect(useCallback(() => {
    refreshEmail();
    const subscription = AppState.addEventListener('change', state => { if (state === 'active') refreshEmail(); });
    return () => subscription.remove();
  }, [refreshEmail]));

  async function sendConfirmation() {
    if (disabled || photoBusy || sendingRef.current || !requireConnection()) return;
    sendingRef.current = true;
    setSending(true);
    try {
      await requestEmailChange(nextEmail);
      if (!mounted.current) return;
      setPendingEmail(nextEmail.trim());
      setNextEmail('');
      Alert.alert('Check Your Email', 'Complete the confirmation links sent to your new email and, if required, your current email. Your account email changes only after confirmation.');
      await refreshEmail();
    } catch (error) {
      if (mounted.current) Alert.alert('Email Change Failed', error.message || 'Please try again.');
    } finally {
      sendingRef.current = false;
      if (mounted.current) setSending(false);
    }
  }

  return <View>
    <ProfilePhoto explicitUpload disabled={disabled || sending} onBusyChange={setPhotoBusy} />
    <Text style={styles.label}>Student ID</Text>
    <Text style={styles.value}>{studentId || 'Not provided'}</Text>
    <Text style={styles.label}>Email</Text>
    <Text style={styles.value}>{email || 'Account email unavailable'}</Text>
    {!!emailError && <>
      <Text style={styles.error}>{emailError}</Text>
      <PrimaryButton title="Refresh Account Email" variant="secondary" onPress={refreshEmail} disabled={disabled || sending || photoBusy} />
    </>}
    <View onLayout={onEmailLayout} style={styles.emailBox}>
      <Text style={styles.heading}>Change account email</Text>
      <TextInput accessibilityLabel="New email address" placeholder="New email address" placeholderTextColor={colors.gray}
        style={styles.input} value={nextEmail} onChangeText={setNextEmail} autoCapitalize="none" autoCorrect={false}
        keyboardType="email-address" editable={!disabled && !sending && !photoBusy} onFocus={onEmailFocus} />
      <PrimaryButton title="Send email change confirmation" onPress={sendConfirmation} loading={sending}
        disabled={disabled || photoBusy || !nextEmail.trim()} />
      {!!pendingEmail && <Text style={styles.hint}>Confirmation pending for {pendingEmail}. Check both inboxes for the required links, then return here.</Text>}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  label: { color: colors.gray, marginTop: 12, marginBottom: 4 },
  value: { color: colors.dark, fontWeight: '600', fontSize: 16 },
  emailBox: { backgroundColor: colors.background, padding: 14, borderRadius: 12, marginTop: 18 },
  heading: { color: colors.dark, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: colors.white, color: colors.dark, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 8 },
  error: { color: colors.danger, marginTop: 8 },
  hint: { color: colors.gray, marginTop: 8, lineHeight: 20 },
});
