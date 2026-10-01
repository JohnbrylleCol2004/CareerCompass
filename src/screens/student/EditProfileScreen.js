import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import { mockUser } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState(mockUser.name);
  const [career, setCareer] = useState(mockUser.currentCareer);
  const [interests, setInterests] = useState(
    mockUser.interests.join(', ')
  );

  function saveProfile() {
    Alert.alert('Saved', 'Your profile has been updated.');
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Career Target</Text>
      <TextInput
        style={styles.input}
        value={career}
        onChangeText={setCareer}
      />

      <Text style={styles.label}>Interests</Text>
      <TextInput
        style={styles.input}
        value={interests}
        onChangeText={setInterests}
      />

      <PrimaryButton
        title="Save Changes"
        onPress={saveProfile}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
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
  },
});