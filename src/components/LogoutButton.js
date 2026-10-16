import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { useNetwork } from '../context/NetworkContext';

export default function LogoutButton() {
  const { logout } = useAuth();
  const { requireConnection } = useNetwork();

  async function handleLogout() {
    if (!requireConnection()) return;
    console.log('LOGOUT BUTTON CLICKED');

    try {
      await logout();
      console.log('LOGOUT SUCCESSFUL');
    } catch (error) {
      console.log('LOGOUT ERROR:', error.message);
    }
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleLogout}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.danger,
    padding: 15,
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
