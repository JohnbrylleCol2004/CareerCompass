import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';

export default function EditProfileScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [career, setCareer] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('No logged-in user found.');
      }

      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      setName(profile.name || '');
      setCareer(profile.current_career || '');

      if (Array.isArray(profile.interests)) {
        setInterests(profile.interests.join(', '));
      } else {
        setInterests(profile.interests || '');
      }
    } catch (error) {
      Alert.alert(
        'Unable to Load Profile',
        error.message || 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter your name.');
      return;
    }

    try {
      setSaving(true);

      const interestsArray = interests
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      const { error } = await supabase
        .from('users')
        .update({
          name: name.trim(),
          current_career: career.trim(),
          interests: interestsArray,
        })
        .eq('id', userId);

      if (error) {
        throw new Error(error.message);
      }

      Alert.alert(
        'Saved',
        'Your profile has been updated successfully.'
      );

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Update Failed',
        error.message || 'Something went wrong while saving.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Edit Profile</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.gray}
        />

        <Text style={styles.label}>Career Target</Text>
        <TextInput
          style={styles.input}
          value={career}
          onChangeText={setCareer}
          placeholder="Enter your career target"
          placeholderTextColor={colors.gray}
        />

        <Text style={styles.label}>
          Interests
        </Text>

        <TextInput
          style={[styles.input, styles.interestsInput]}
          value={interests}
          onChangeText={setInterests}
          placeholder="Example: Coding, Design, Business"
          placeholderTextColor={colors.gray}
          multiline
        />

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