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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Choose a username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Put the Account Type section here */}
        <Text style={styles.label}>Account Type</Text>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'student' && styles.selectedRole,
            ]}
            onPress={() => setRole('student')}
          >
            <Text>Student</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'admin' && styles.selectedRole,
            ]}
            onPress={() => setRole('admin')}
          >
            <Text>Admin</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton
          title="Register"
          onPress={handleRegister}
        />
      </ScrollView>
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
    marginBottom: 25,
  },
  label: {
    color: colors.dark,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 13,
    fontSize: 15,
  },
  loginRow: {
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
  roleContainer: {
  flexDirection: 'row',
  gap: 10,
  marginBottom: 15,
},

roleButton: {
  flex: 1,
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
});