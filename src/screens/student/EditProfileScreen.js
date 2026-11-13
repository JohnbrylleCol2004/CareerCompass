import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import ProfileAccountCard from '../../components/ProfileAccountCard';
import ProfileSelect from '../../components/ProfileSelect';
import { getCareerOptions } from '../../services/profileAccountService';
import { ACADEMIC_YEARS, PROGRAM, PROFILE_FIELDS, normalizeProgram, serializeProfile, validateProfileFields } from '../../utils/profileFields.mjs';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { useNetwork } from '../../context/NetworkContext';

const fields = [
  ['username', 'Username'],
  ['first_name', 'First Name'],
  ['middle_name', 'Middle Name'],
  ['last_name', 'Surname'],
  ['student_id', 'Student ID'],
  ['department', 'Department'],
  ['position', 'Position'],
];

const selectionFields = [
  { key: 'interests', label: 'Career Interests', max: 3, options: [
    'Web Development', 'Networking', 'Data Analytics', 'Cloud Computing',
    'Cybersecurity', 'UI/UX Design', 'Mobile Development',
  ] },
  { key: 'technologies', label: 'Technologies', max: 5, options: [
    'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Supabase', 'Python', 'MySQL', 'Git',
  ] },
];

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const { requireConnection } = useNetwork();
  const headerHeight = useHeaderHeight();
  const scrollRef = useRef(null);
  const fieldPositions = useRef({});
  const groupPositions = useRef({});
  const focusedField = useRef(null);
  const savingRef = useRef(false);
  const mounted = useRef(true);
  const [accountBusy, setAccountBusy] = useState(false);
  const [careers, setCareers] = useState(null);
  const [careerError, setCareerError] = useState('');
  const [careersLoading, setCareersLoading] = useState(true);
  const careerRequest = useRef(0);
  const loadCareers = useCallback(() => {
    const request = ++careerRequest.current;
    return getCareerOptions().then(options => {
      if (mounted.current && request === careerRequest.current) {
        setCareers([...new Set(options.map(item => item.name))]);
        setCareerError('');
      }
    }).catch(error => {
      if (mounted.current && request === careerRequest.current) setCareerError(error.message || 'Unable to load career goals.');
    }).finally(() => {
      if (mounted.current && request === careerRequest.current) setCareersLoading(false);
    });
  }, []);
  useEffect(() => {
    mounted.current = true;
    loadCareers();
    return () => { mounted.current = false; careerRequest.current += 1; };
  }, [loadCareers]);

  function revealFocusedField() {
    const field = fieldPositions.current[focusedField.current];
    if (field) {
      const y = field.y + (groupPositions.current[field.group] || 0);
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
    }
  }
  const [values, setValues] = useState(() => Object.fromEntries(
    PROFILE_FIELDS.map(key => [key, key === 'program' ? normalizeProgram(user?.[key]) : String(user?.[key] || '')])
  ));
  const [saving, setSaving] = useState(false);
  const busy = saving || accountBusy;
  const [selections, setSelections] = useState(() => Object.fromEntries(
    selectionFields.map(({ key }) => [key, [...new Set(
      (Array.isArray(user?.[key]) ? user[key] : String(user?.[key] || '').split(','))
        .filter(item => typeof item === 'string').map(item => item.trim()).filter(Boolean)
    )]])
  ));

  function toggleSelection(key, option, max) {
    if (busy) return;
    setSelections(current => ({
      ...current,
      [key]: current[key].includes(option)
        ? current[key].filter(item => item !== option)
        : current[key].length < max ? [...current[key], option] : current[key],
    }));
  }

  async function saveProfile() {
    if (savingRef.current || accountBusy || !requireConnection()) return;
    if (!values.first_name.trim() || !values.last_name.trim() || !values.username.trim()) {
      Alert.alert('Missing Information', 'Please enter your first name, last name, and username.');
      return;
    }
    const invalidField = selectionFields.find(({ key, options, max }) =>
      selections[key].length > max || selections[key].some(item => !options.includes(item))
    );
    if (invalidField) {
      Alert.alert('Review Selections', `Choose up to ${invalidField.max} predefined options for ${invalidField.label.toLowerCase()}. Uncheck any previous custom entries.`);
      return;
    }
    const fieldError = validateProfileFields(values, careers);
    if (fieldError) {
      Alert.alert('Review Profile', fieldError);
      return;
    }
    try {
      savingRef.current = true;
      setSaving(true);
      const profile = serializeProfile(values, selections);
      await updateProfile(profile);
      if (!mounted.current) return;
      Alert.alert('Saved', 'Your profile has been updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Update Failed', error?.message || 'Unable to save your profile.');
    } finally {
      savingRef.current = false;
      if (mounted.current) setSaving(false);
    }
  }

  function renderField([key, label], group) {
    return <View key={key} onLayout={event => { fieldPositions.current[key] = { group, y: event.nativeEvent.layout.y }; }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} style={styles.input}
        onFocus={() => { focusedField.current = key; revealFocusedField(); }}
        onBlur={() => { if (focusedField.current === key) focusedField.current = null; }}
        value={values[key]} onChangeText={value => setValues(current => ({ ...current, [key]: value }))}
        editable={!busy} autoCapitalize={key === 'username' ? 'none' : 'sentences'} />
    </View>;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
      <ScrollView
        ref={scrollRef}
        onLayout={revealFocusedField}
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.card} onLayout={event => { groupPositions.current.account = event.nativeEvent.layout.y + 18; }}>
          <ProfileAccountCard studentId={user?.student_id} disabled={saving} onBusyChange={setAccountBusy}
            onEmailLayout={event => { fieldPositions.current.email = { group: 'account', y: event.nativeEvent.layout.y }; }}
            onEmailFocus={() => { focusedField.current = 'email'; revealFocusedField(); }} />
        </View>
        <View style={styles.card} onLayout={event => { groupPositions.current.personal = event.nativeEvent.layout.y; }}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          {fields.filter(([key]) => ['first_name', 'middle_name', 'last_name', 'student_id'].includes(key)).map(field => renderField(field, 'personal'))}
          <ProfileSelect label="Academic Year" value={values.academic_year} options={ACADEMIC_YEARS}
            placeholder="Select academic year" disabled={busy} onValueChange={academic_year => setValues(current => ({ ...current, academic_year }))} />
          <ProfileSelect label="Program / Course" value={values.program} options={[PROGRAM]}
            placeholder="Select program / course" disabled={busy} onValueChange={program => setValues(current => ({ ...current, program }))} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferred Career Goal</Text>
          <ProfileSelect label="Preferred Career Goal" value={values.career_target} options={careers || []}
            placeholder={careersLoading ? 'Loading career goals…' : 'Select a target'} disabled={busy || careersLoading || careers === null}
            onValueChange={career_target => setValues(current => ({ ...current, career_target }))} />
          {!!careerError && <>
            <Text style={styles.selectionWarning}>{careerError} Your saved career goal is preserved.</Text>
            <PrimaryButton title="Retry Career Goals" variant="secondary" disabled={busy || careersLoading}
              onPress={() => { setCareersLoading(true); loadCareers(); }} />
          </>}
          {!careersLoading && careers?.length === 0 && <Text style={styles.selectionHint}>No career goals are currently available.</Text>}
          <Text style={styles.helpText}>This is your preference for personalized guidance. Career recommendations are ranked separately using your skills and interests.</Text>
          <View style={styles.track}>
            <Text style={styles.selectionCount}>Selected Track</Text>
            <Text style={styles.trackName}>{values.career_target || 'Not selected'}</Text>
          </View>
        </View>
        <View style={styles.card} onLayout={event => { groupPositions.current.additional = event.nativeEvent.layout.y; }}>
          <Text style={styles.cardTitle}>Additional Details</Text>
          {fields.filter(([key]) => ['username', 'department', 'position'].includes(key)).map(field => renderField(field, 'additional'))}
        </View>
        <View style={styles.card}>
        <Text style={styles.sectionTitle}>Interests &amp; Technologies</Text>
        {selectionFields.map(({ key, label, options, max }) => {
          const selected = selections[key];
          const custom = selected.filter(item => !options.includes(item));
          return (
            <View key={key} style={styles.selectionGroup}>
              <View style={styles.selectionHeader}>
                <Text style={styles.selectionLabel}>{label}</Text>
                <Text style={styles.selectionCount}>{selected.length}/{max} selected</Text>
              </View>
              <Text style={styles.selectionHint}>Choose up to {max} options.</Text>
              {custom.length > 0 && (
                <Text style={styles.selectionWarning}>Uncheck previous custom entries before saving: {custom.join(', ')}.</Text>
              )}
              {[...options, ...custom].map(option => {
                const checked = selected.includes(option);
                const disabled = busy || (!checked && selected.length >= max);
                return (
                  <Pressable
                    key={option}
                    accessibilityRole="checkbox"
                    accessibilityLabel={option}
                    accessibilityState={{ checked, disabled }}
                    disabled={disabled}
                    onPress={() => toggleSelection(key, option, max)}
                    style={[styles.option, checked && styles.selectedOption, disabled && styles.disabledOption]}
                  >
                    <View style={[styles.checkbox, checked && styles.checkedBox]}>
                      {checked && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.optionLabel}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
        </View>
        <PrimaryButton
          title="Save Profile"
          loading={saving}
          disabled={accountBusy}
          onPress={saveProfile}
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 18 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: colors.dark, marginBottom: 6 },
  helpText: { color: colors.gray, lineHeight: 20, marginTop: 12 },
  track: { backgroundColor: colors.secondary, borderRadius: 12, padding: 16, marginTop: 18 },
  trackName: { color: colors.primaryDark, fontSize: 20, fontWeight: 'bold', marginTop: 6 },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  loadingText: {
    color: colors.dark,
    fontSize: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 20,
  },

  label: {
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.dark,
    fontSize: 15,
  },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.dark, marginTop: 24, marginBottom: 16 },
  selectionGroup: { marginBottom: 20 },
  selectionHeader: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  selectionLabel: { fontWeight: 'bold', color: colors.dark, fontSize: 16 },
  selectionCount: { color: colors.gray },
  selectionHint: { color: colors.gray, marginTop: 6, marginBottom: 10 },
  selectionWarning: { color: colors.danger, marginBottom: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: colors.white },
  selectedOption: { borderColor: colors.primary, backgroundColor: colors.secondary },
  disabledOption: { opacity: 0.5 },
  checkbox: { width: 22, height: 22, borderWidth: 1, borderColor: colors.gray, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  checkedBox: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
  optionLabel: { flex: 1, color: colors.dark, fontSize: 15 },
});
