import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    const cleanName = name.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanUsername || !cleanEmail || !password) {
      Alert.alert(
        'Incomplete Form',
        'Please complete all required fields.'
      );
      return;
    }

    if (!cleanEmail.includes('@')) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Weak Password',
        'Your password must contain at least 6 characters.'
      );
      return;
    }

    try {
      setLoading(true);

      await register({
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        password,
        role,
      });

      Alert.alert(
        'Registration Successful',
        `Welcome, ${cleanName}!`
      );

      // AuthContext should automatically open the correct navigator.
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error?.message || 'Something went wrong during registration.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>
            Register for Career Compass
          </Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={colors.gray}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor={colors.gray}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor={colors.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Account Type</Text>

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'student' && styles.selectedRole,
              ]}
              onPress={() => setRole('student')}
              disabled={loading}
            >
              <Text
                style={[
                  styles.roleText,
                  role === 'student' && styles.selectedRoleText,
                ]}
              >
                Student
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'admin' && styles.selectedRole,
              ]}
              onPress={() => setRole('admin')}
              disabled={loading}
            >
              <Text
                style={[
                  styles.roleText,
                  role === 'admin' && styles.selectedRoleText,
                ]}
              >
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          <PrimaryButton
            title={loading ? 'Registering...' : 'Register'}
            onPress={loading ? undefined : handleRegister}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              Already have an account? Login
            </Text>
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

  keyboardView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
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
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 24,
  },

  label: {
    color: colors.dark,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 13,
    fontSize: 15,
    color: colors.dark,
  },

  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  roleButton: {
    width: '48%',
    padding: 14,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },

  selectedRole: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
  },

  roleText: {
    color: colors.dark,
    fontWeight: 'bold',
  },

  selectedRoleText: {
    color: colors.primaryDark,
  },

  loginText: {
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: 18,
    fontWeight: 'bold',
  },
});