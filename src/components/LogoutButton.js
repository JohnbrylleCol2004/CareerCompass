import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { useNetwork } from '../context/NetworkContext';

export default function LogoutButton() {
  const { logout } = useAuth();
  const { requireConnection } = useNetwork();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading || !requireConnection()) return;
    setLoading(true);

    try {
      await logout();
    } catch (error) {
      Alert.alert('Could not log out', error?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleLogout}
      activeOpacity={0.7}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel="Log out"
      accessibilityState={{ disabled: loading, busy: loading }}
    >
      {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.text}>Log out</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.danger,
    padding: 15,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
