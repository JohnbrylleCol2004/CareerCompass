import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';

import AppHeader from '../../components/AppHeader';
import SummaryCard from '../../components/SummaryCard';
import PrimaryButton from '../../components/PrimaryButton';
import LogoutButton from '../../components/LogoutButton';
import { colors } from '../../theme/colors';

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();

  const interests = Array.isArray(user?.interests)
    ? user.interests.join(', ')
    : user?.interests || 'No interests added';

  const technologies = Array.isArray(user?.technologies)
    ? user.technologies.join(', ')
    : user?.technologies || 'No technologies added';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader title="Student Profile" />

        <SummaryCard
          title="Name"
          value={user?.name || 'Not provided'}
        />

        <SummaryCard
          title="Academic Year"
          value={
            user?.academic_year || 'Not provided'
          }
        />

        <SummaryCard
          title="Experience Level"
          value={
            user?.experience_level || 'Not provided'
          }
        />

        <SummaryCard
          title="Career Target"
          value={
            user?.current_career || 'Not provided'
          }
        />

        <SummaryCard
          title="Interests"
          description={interests}
        />

        <SummaryCard
          title="Technologies"
          description={technologies}
        />

        <PrimaryButton
          title="Edit Profile"
          onPress={() =>
            navigation.navigate('EditProfile')
          }
        />

        <LogoutButton />
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
    padding: 16,
    paddingBottom: 24,
  },
});