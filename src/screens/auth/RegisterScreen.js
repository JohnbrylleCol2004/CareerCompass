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

import { Picker } from '@react-native-picker/picker';
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
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanUsername ||
      !cleanEmail ||
      !password ||
      !academicYear
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
      suffix,
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
        suffix,
        username: cleanUsername,
        email: cleanEmail,
        password,
        academicYear,
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
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Middle Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your middle name"
            value={middleName}
            onChangeText={setMiddleName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />

         <Text style={styles.label}>Suffix</Text>

         <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={suffix}
            onValueChange={(value) => setSuffix(value)}
           enabled={!loading}
                              >
          <Picker.Item label="No suffix" value="" />
          <Picker.Item label="Jr." value="Jr." />
          <Picker.Item label="Sr." value="Sr." />
          <Picker.Item label="II" value="II" />
          <Picker.Item label="III" value="III" />
          <Picker.Item label="IV" value="IV" />
          <Picker.Item label="V" value="V" />
         </Picker>
        </View>

          <Text style={styles.label}>Year Level *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={academicYear}
              onValueChange={(value) => setAcademicYear(value)}
              enabled={!loading}
            >
              <Picker.Item
                label="Select year level"
                value=""
              />
              <Picker.Item
                label="1st Year"
                value="1st Year"
              />
              <Picker.Item
                label="2nd Year"
                value="2nd Year"
              />
              <Picker.Item
                label="3rd Year"
                value="3rd Year"
              />
              <Picker.Item
                label="4th Year"
                value="4th Year"
              />
            </Picker>
          </View>

          <Text style={styles.label}>Username *</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
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

  pickerContainer: {
    width: '55%',
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },

  picker: {
    width: '100%',
    height: 48,
    fontSize: 14,
  },

  loginText: {
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: 18,
    fontWeight: 'bold',
  },
});