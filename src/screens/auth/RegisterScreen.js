import React, { useState } from 'react';
import {
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

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    const cleanFirstName = firstName.trim();
    const cleanMiddleName = middleName.trim();
    const cleanLastName = lastName.trim();
    const cleanSuffix = suffix.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanAcademicYear = academicYear.trim();

    if (
      !cleanFirstName ||
      !cleanMiddleName ||
      !cleanLastName ||
      !cleanUsername ||
      !cleanEmail ||
      !password ||
      !cleanAcademicYear
    ) {
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
        'Password must contain at least 6 characters.'
      );
      return;
    }

    const fullName = [
      cleanFirstName,
      cleanMiddleName,
      cleanLastName,
      cleanSuffix,
    ]
      .filter(Boolean)
      .join(' ');

    try {
      setLoading(true);

      await register({
        name: fullName,
        firstName: cleanFirstName,
        middleName: cleanMiddleName,
        lastName: cleanLastName,
        suffix: cleanSuffix,
        username: cleanUsername,
        email: cleanEmail,
        password,
        academicYear: cleanAcademicYear,
      });

      Alert.alert(
        'Registration Successful',
        `Welcome, ${fullName}!`
      );
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error?.message || 'Something went wrong.'
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
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>
            Register for Career Compass
          </Text>

          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            placeholderTextColor={colors.gray}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Middle Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your middle name"
            placeholderTextColor={colors.gray}
            value={middleName}
            onChangeText={setMiddleName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            placeholderTextColor={colors.gray}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Suffix (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Jr., Sr., II, III"
            placeholderTextColor={colors.gray}
            value={suffix}
            onChangeText={setSuffix}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Year Level *</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: 1st Year"
            placeholderTextColor={colors.gray}
            value={academicYear}
            onChangeText={setAcademicYear}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Username *</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor={colors.gray}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Email *</Text>
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

          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor={colors.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

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

  loginText: {
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: 18,
    fontWeight: 'bold',
  },
});