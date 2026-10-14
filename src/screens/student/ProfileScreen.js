import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
          value={[user?.first_name, user?.middle_name, user?.last_name].filter(Boolean).join(' ') || 'Not provided'}
        />

        <SummaryCard
          title="Student ID"
          value={
            user?.student_id || 'Not provided'
          }
        />

        <SummaryCard
          title="Program / Course"
          value={
            user?.program || 'Not provided'
          }
        />

        <SummaryCard
          title="Career Target"
          value={
            user?.career_target || 'Not provided'
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

        <SummaryCard title="Username" value={user?.username || 'Not provided'} />
        <SummaryCard title="Department" value={user?.department || 'Not provided'} />
        <SummaryCard title="Position" value={user?.position || 'Not provided'} />

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
