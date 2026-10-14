import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Picker } from '@react-native-picker/picker';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

const careerOptions = [
  'Web Development',
  'Data Analytics',
  'Cloud Computing',
  'Cybersecurity',
  'UI/UX Design',
  'Mobile Development',
];

const technologyOptions = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'SQL',
  'Firebase',
];

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const { width, fontScale } = useWindowDimensions();
  const useSingleColumn = width / Math.max(fontScale, 1) < 600;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [program, setProgram] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [interests, setInterests] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(false);

  function toggleInterest(item) {
    setInterests((currentItems) =>
      currentItems.includes(item)
        ? currentItems.filter((value) => value !== item)
        : [...currentItems, item]
    );
  }

  function toggleTechnology(item) {
    setTechnologies((currentItems) =>
      currentItems.includes(item)
        ? currentItems.filter((value) => value !== item)
        : [...currentItems, item]
    );
  }

  async function handleRegister() {
    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanStudentId = studentId.trim();
    const cleanProgram = program.trim();

    if (
      !cleanFullName ||
      !cleanEmail ||
      !cleanStudentId ||
      !academicYear ||
      !experienceLevel ||
      !cleanProgram ||
      !password ||
      !confirmPassword
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

    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Passwords do not match.'
      );
      return;
    }

    try {
      setLoading(true);

      await register({
        name: cleanFullName,
        email: cleanEmail,
        studentId: cleanStudentId,
        academicYear,
        experienceLevel,
        program: cleanProgram,
        interests,
        technologies,
        password,
        role: 'student',
      });

      Alert.alert(
        'Registration Successful',
        `Welcome, ${cleanFullName}!`
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

  function CheckOption({ label, selected, onPress }) {
    return (
      <TouchableOpacity
        style={[
          styles.checkOption,
          useSingleColumn && styles.fullWidthOption,
          selected && styles.selectedOption,
        ]}
        onPress={onPress}
        disabled={loading}
      >
        <View
          style={[
            styles.checkbox,
            selected && styles.checkboxSelected,
          ]}
        >
          {selected && <Text style={styles.checkMark}>✓</Text>}
        </View>

        <Text style={styles.optionText}>{label}</Text>
      </TouchableOpacity>
    );
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
          <View style={styles.header}>
            <Text style={styles.headerIcon}>♙</Text>

            <Text style={styles.title}>
              Register Form
            </Text>

            <Text style={styles.subtitle}>
              Create your Career Compass account
            </Text>
          </View>

          <View style={[styles.formRow, useSingleColumn && styles.formColumn]}>
            <View style={[styles.halfField, useSingleColumn && styles.fullField]}>
              <Text style={styles.label}>Full Name *</Text>

              <TextInput
                style={styles.input}
                placeholder="Example: Juan Dela Cruz"
                placeholderTextColor={colors.gray}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.halfField, useSingleColumn && styles.fullField]}>
              <Text style={styles.label}>Email Address *</Text>

              <TextInput
                style={styles.input}
                placeholder="example@email.com"
                placeholderTextColor={colors.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={[styles.formRow, useSingleColumn && styles.formColumn]}>
            <View style={[styles.halfField, useSingleColumn && styles.fullField]}>
              <Text style={styles.label}>
                Student ID *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Example: 2024-00123"
                placeholderTextColor={colors.gray}
                value={studentId}
                onChangeText={setStudentId}
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.halfField, useSingleColumn && styles.fullField]}>
              <Text style={styles.label}>
                Account Type
              </Text>

              <View style={styles.staticInput}>
                <Text style={styles.staticText}>
                  Register as Student
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.formRow, useSingleColumn && styles.formColumn]}>
            <View style={[styles.halfField, useSingleColumn && styles.fullField]}>
              <Text style={styles.label}>
                Academic Year *
              </Text>

              <View style={styles.pickerContainer}>
                <Picker
                  mode="dropdown"
                  selectedValue={academicYear}
                  onValueChange={setAcademicYear}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  dropdownIconColor={colors.dark}
                >
                  <Picker.Item
                    style={styles.pickerItem}
                    label="Select academic year"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItem}
                    label="1st Year"
                    value="1st Year"
                  />
                  <Picker.Item
                    style={styles.pickerItem}
                    label="2nd Year"
                    value="2nd Year"
                  />
                  <Picker.Item
                    style={styles.pickerItem}
                    label="3rd Year"
                    value="3rd Year"
                  />
                  <Picker.Item
                    style={styles.pickerItem}
                    label="4th Year"
                    value="4th Year"
                  />
                </Picker>
              </View>
            </View>

            <View style={[styles.halfField, useSingleColumn && styles.fullField]}>
              <Text style={styles.label}>
                Experience Level *
              </Text>

              <View style={styles.pickerContainer}>
                <Picker
                  mode="dropdown"
                  selectedValue={experienceLevel}
                  onValueChange={setExperienceLevel}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  dropdownIconColor={colors.dark}
                >
                  <Picker.Item
                    style={styles.pickerItem}
                    label="Select experience level"
                    value=""
                  />
                  <Picker.Item
                    style={styles.pickerItem}
                    label="Beginner"
                    value="Beginner"
                  />
                  <Picker.Item
                    style={styles.pickerItem}
                    label="Entry Level"
                    value="Entry Level"
                  />
                  <Picker.Item
                    style={styles.pickerItem}
                    label="Intermediate"
                    value="Intermediate"
                  />
                  <Picker.Item
                    style={styles.pickerItem}
                    label="Advanced"
                    value="Advanced"
                  />
                </Picker>
              </View>
            </View>
          </View>

          <Text style={styles.label}>Program / Course *</Text>

          <TextInput
            style={styles.input}
            placeholder="Example: BS Information Technology"
            placeholderTextColor={colors.gray}
            value={program}
            onChangeText={setProgram}
            autoCapitalize="words"
          />

          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>
              Career Interests
            </Text>

            <Text style={styles.sectionSubtitle}>
              Choose one or more areas you are interested in.
            </Text>

            <View style={styles.optionsGrid}>
              {careerOptions.map((item) => (
                <CheckOption
                  key={item}
                  label={item}
                  selected={interests.includes(item)}
                  onPress={() => toggleInterest(item)}
                />
              ))}
            </View>
          </View>

          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>
              Technologies / Skills
            </Text>

            <Text style={styles.sectionSubtitle}>
              Select technologies you already know or want to improve.
            </Text>

            <View style={styles.optionsGrid}>
              {technologyOptions.map((item) => (
                <CheckOption
                  key={item}
                  label={item}
                  selected={technologies.includes(item)}
                  onPress={() => toggleTechnology(item)}
                />
              ))}
            </View>
          </View>

          <View style={[styles.formRow, useSingleColumn && styles.formColumn]}>
            <View style={[styles.halfField, useSingleColumn && styles.fullField]}>
              <Text style={styles.label}>Password *</Text>

              <TextInput
                style={styles.input}
                placeholder="Minimum of 6 characters"
                placeholderTextColor={colors.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.halfField, useSingleColumn && styles.fullField]}>
              <Text style={styles.label}>
                Confirm Password *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor={colors.gray}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <PrimaryButton
            title={loading ? 'Signing Up...' : 'Sign Up'}
            onPress={loading ? undefined : handleRegister}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLink}>Login</Text>
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
    backgroundColor: '#F3FFFC',
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 35,
  },

  header: {
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#BFEDE3',
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#36A88F',
    color: colors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 28,
    marginBottom: 10,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.dark,
  },

  subtitle: {
    color: colors.gray,
    marginTop: 5,
  },

  formRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: 12,
  },

  formColumn: {
    flexDirection: 'column',
  },

  fullField: {
    flexBasis: 'auto',
    flexGrow: 0,
    width: '100%',
  },

  halfField: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 240,
    minWidth: 0,
  },

  label: {
    color: colors.dark,
    fontWeight: 'bold',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    minHeight: 50,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.dark,
    fontSize: 14,
  },

  staticInput: {
    minHeight: 50,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#36A88F',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  staticText: {
    color: colors.dark,
    fontSize: 14,
  },

  pickerContainer: {
    minHeight: 56,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    overflow: 'hidden',
  },

  picker: {
    height: Platform.OS === 'ios' ? 216 : 56,
    width: '100%',
    color: colors.dark,
    fontSize: 14,
  },

  pickerItem: {
    fontSize: 14,
  },

  sectionBox: {
    marginTop: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFEDE3',
    borderRadius: 12,
    backgroundColor: '#F8FFFD',
  },

  sectionTitle: {
    color: colors.dark,
    fontWeight: 'bold',
    fontSize: 14,
  },

  sectionSubtitle: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 3,
    marginBottom: 12,
  },

  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 9,
  },

  checkOption: {
    width: '48%',
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },

  fullWidthOption: {
    width: '100%',
  },

  selectedOption: {
    borderColor: '#36A88F',
    backgroundColor: '#E9FAF5',
  },

  checkbox: {
    flexShrink: 0,
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },

  checkboxSelected: {
    backgroundColor: '#36A88F',
    borderColor: '#36A88F',
  },

  checkMark: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },

  optionText: {
    flex: 1,
    color: colors.dark,
    fontSize: 11,
  },

  loginText: {
    color: colors.dark,
    textAlign: 'center',
    marginTop: 18,
    fontSize: 12,
  },

  loginLink: {
    color: '#168C78',
    fontWeight: 'bold',
  },
});
