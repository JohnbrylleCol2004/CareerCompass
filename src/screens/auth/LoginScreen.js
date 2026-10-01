import { useAuth } from '../../context/AuthContext';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
  if (!username || !password) {
    Alert.alert(
      'Missing Information',
      'Please enter your username and password.'
    );
    return;
  }

  try {
    await login(username, password);

    Alert.alert(
      'Login Successful',
      'Welcome back!'
    );
  } catch (error) {
    Alert.alert('Login Failed', error.message);
  }
}

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.subtitle}>
          Access your Career Compass account
        </Text>

        <Text style={styles.label}>Username or Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username or email"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPassword}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Login"
          onPress={handleLogin}
        />

        <View style={styles.registerRow}>
          <Text style={styles.normalText}>
            Do not have an account?
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.link}> Register</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
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
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 13,
    fontSize: 15,
  },
  forgotPassword: {
    textAlign: 'right',
    color: colors.primary,
    marginTop: 12,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  normalText: {
    color: colors.gray,
  },
  link: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  back: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 22,
    fontWeight: 'bold',
  },
});