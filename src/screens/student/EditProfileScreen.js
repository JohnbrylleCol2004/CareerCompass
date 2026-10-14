import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

const fields = [
  ['username', 'Username'],
  ['first_name', 'First Name'],
  ['middle_name', 'Middle Name'],
  ['last_name', 'Last Name'],
  ['student_id', 'Student ID'],
  ['program', 'Program / Course'],
  ['department', 'Department'],
  ['position', 'Position'],
  ['career_target', 'Career Target'],
  ['interests', 'Interests (comma-separated)'],
  ['technologies', 'Technologies (comma-separated)'],
];

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [values, setValues] = useState(() => Object.fromEntries(
    fields.map(([key]) => [key, Array.isArray(user?.[key])
      ? user[key].join(', ') : user?.[key] || ''])
  ));
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    if (!values.first_name.trim() || !values.last_name.trim() || !values.username.trim()) {
      Alert.alert('Missing Information', 'Please enter your first name, last name, and username.');
      return;
    }
    try {
      setSaving(true);
      const profile = Object.fromEntries(fields.map(([key]) => [key,
        ['interests', 'technologies'].includes(key)
          ? values[key].split(',').map(item => item.trim()).filter(Boolean)
          : values[key].trim(),
      ]));
      await updateProfile(profile);
      Alert.alert('Saved', 'Your profile has been updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Update Failed', error?.message || 'Unable to save your profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Edit Profile</Text>
        {fields.map(([key, label]) => (
          <View key={key}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              value={values[key]}
              onChangeText={value => setValues(current => ({ ...current, [key]: value }))}
              editable={!saving}
              autoCapitalize={key === 'username' ? 'none' : 'sentences'}
              multiline={['interests', 'technologies'].includes(key)}
            />
          </View>
        ))}
        <PrimaryButton
          title={saving ? 'Saving...' : 'Save Changes'}
          onPress={saving ? undefined : saveProfile}
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

  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    padding: 20,
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

  interestsInput: {
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
});
