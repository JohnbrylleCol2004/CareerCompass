import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import PrimaryButton from '../../components/PrimaryButton';
import PasswordInput from '../../components/PasswordInput';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { useNetwork } from '../../context/NetworkContext';

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
  const { requireConnection } = useNetwork();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const fieldPositions = useRef({});
  const passwordRowY = useRef(0);
  const focusedField = useRef(null);
  const { width, fontScale } = useWindowDimensions();
  const useSingleColumn = width / Math.max(fontScale, 1) < 600;

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [careerTarget, setCareerTarget] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [program, setProgram] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [interests, setInterests] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(false);

  function revealFocusedField() {
    const key = focusedField.current;
    const fieldY = fieldPositions.current[key];
    if (typeof fieldY !== 'number') return;
    // Password fields are nested inside a responsive row; include its offset.
    const y = fieldY + (['password', 'confirmPassword'].includes(key) ? passwordRowY.current : 0);
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
  }

  function focusField(key) {
    focusedField.current = key;
    revealFocusedField();
  }

  useEffect(() => {
    // Reposition after the keyboard has finished changing the available height.
    const subscription = Keyboard.addListener('keyboardDidShow', revealFocusedField);
    return () => subscription.remove();
  }, []);

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
    if (!requireConnection()) return;
    const cleanEmail = email.trim().toLowerCase();
    const cleanStudentId = studentId.trim();
    const cleanProgram = program.trim();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !cleanEmail ||
      !cleanStudentId ||
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

      const result = await register({
        firstName,
        middleName,
        lastName,
        username,
        department,
        position,
        careerTarget,
        email: cleanEmail,
        studentId: cleanStudentId,
        program: cleanProgram,
        interests,
        technologies,
        password,
      });

      if (result.requiresEmailConfirmation) {
        setPassword('');
        setConfirmPassword('');
        Alert.alert('Check your email',
          'If this email can be registered, a confirmation link has been sent. Confirm your email, then log in to finish setting up your profile.',
          [{ text: 'Go to Login', onPress: () => navigation.navigate('Login') }]);
        return;
      }

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
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked: selected, disabled: loading }}
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
          {selected && <Ionicons name="checkmark" size={15} color={colors.white} />}
        </View>

        <Text style={styles.optionText}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          onLayout={revealFocusedField}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.header}>
            <Image source={require('../../../assets/careercompass_logo.png')} style={styles.headerIcon} accessibilityLabel="CareerCompass logo" />

            <Text style={styles.title}>
              Create account
            </Text>

            <Text style={styles.subtitle}>
              Create your Career Compass account
            </Text>
          </View>

          {[
            ['First Name *', firstName, setFirstName, 'Enter first name'],
            ['Middle Name', middleName, setMiddleName, 'Enter middle name (optional)'],
            ['Last Name *', lastName, setLastName, 'Enter last name'],
            ['Username *', username, setUsername, 'Choose a username'],
            ['Email Address *', email, setEmail, 'example@email.com'],
            ['Student ID *', studentId, setStudentId, 'Example: 2024-00123'],
            ['Program / Course *', program, setProgram, 'Example: BSIT'],
            ['Department', department, setDepartment, 'Enter department'],
            ['Position', position, setPosition, 'Enter position (optional)'],
            ['Career Target', careerTarget, setCareerTarget, 'Example: Web and Applications Developer'],
          ].map(([label, value, onChangeText, placeholder]) => (
            <View key={label} onLayout={event => { fieldPositions.current[label] = event.nativeEvent.layout.y; }}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.gray}
                keyboardType={label === 'Email Address *' ? 'email-address' : 'default'}
                autoCapitalize={['Username *', 'Email Address *', 'Student ID *'].includes(label) ? 'none' : 'words'}
                autoCorrect={false}
                editable={!loading}
                onFocus={() => focusField(label)}
                onBlur={() => { focusedField.current = null; }}
              />
            </View>
          ))}

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

          <View style={[styles.formRow, useSingleColumn && styles.formColumn]}
            onLayout={event => { passwordRowY.current = event.nativeEvent.layout.y; }}>
            <View style={[styles.halfField, useSingleColumn && styles.fullField]}
              onLayout={event => { fieldPositions.current.password = event.nativeEvent.layout.y; }}>
              <Text style={styles.label}>Password *</Text>

              <PasswordInput
                style={styles.input}
                placeholder="Minimum of 6 characters"
                placeholderTextColor={colors.gray}
                value={password}
                onChangeText={setPassword}
                onFocus={() => focusField('password')}
                onBlur={() => { focusedField.current = null; }}
                editable={!loading}
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.halfField, useSingleColumn && styles.fullField]}
              onLayout={event => { fieldPositions.current.confirmPassword = event.nativeEvent.layout.y; }}>
              <Text style={styles.label}>
                Confirm Password *
              </Text>

              <PasswordInput
                style={styles.input}
                accessibilityLabel="Confirm password"
                placeholder="Re-enter your password"
                placeholderTextColor={colors.gray}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => focusField('confirmPassword')}
                onBlur={() => { focusedField.current = null; }}
                editable={!loading}
                autoCapitalize="none"
              />
            </View>
          </View>

          <PrimaryButton
            title="Sign Up"
            loading={loading}
            onPress={handleRegister}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Log in to an existing account"
            style={styles.loginButton}
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
    backgroundColor: colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollView: {
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
    borderBottomColor: colors.border,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
    borderColor: colors.primary,
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
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
  },

  sectionTitle: {
    color: colors.dark,
    fontWeight: 'bold',
    fontSize: 14,
  },

  sectionSubtitle: {
    color: colors.gray,
    fontSize: 14,
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
    minHeight: 48,
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
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },

  checkbox: {
    flexShrink: 0,
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },

  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  optionText: {
    flex: 1,
    color: colors.dark,
    fontSize: 14,
  },

  loginButton: { minHeight: 48, justifyContent: 'center' },

  loginText: {
    color: colors.dark,
    textAlign: 'center',
    marginTop: 18,
    fontSize: 14,
  },

  loginLink: {
    color: colors.primaryDark,
    fontWeight: 'bold',
  },
});
