import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import StudentMenuHeader from '../../components/StudentMenuHeader';
import ProfilePhoto from '../../components/ProfilePhoto';
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StudentMenuHeader title="Student Profile" current="Profile" navigation={navigation} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        <ProfilePhoto />

        <SummaryCard
          title="Name"
          variant="list"
          value={[user?.first_name, user?.middle_name, user?.last_name].filter(Boolean).join(' ') || 'Not provided'}
        />

        <SummaryCard
          title="Student ID"
          variant="list"
          value={
            user?.student_id || 'Not provided'
          }
        />

        <SummaryCard
          title="Program / Course"
          variant="list"
          value={
            user?.program || 'Not provided'
          }
        />

        <SummaryCard
          title="Preferred Career Goal"
          variant="list"
          value={
            user?.career_target || 'Not provided'
          }
        />

        <SummaryCard
          title="Interests"
          variant="list"
          value={interests || 'No interests added'}
        />

        <SummaryCard
          title="Technologies"
          variant="list"
          value={technologies || 'No technologies added'}
        />

        <SummaryCard title="Username" value={user?.username || 'Not provided'} variant="list" />
        <SummaryCard title="Academic Year" value={user?.academic_year || 'Not provided'} variant="list" />
        <SummaryCard title="Department" value={user?.department || 'Not provided'} variant="list" />
        <SummaryCard title="Position" value={user?.position || 'Not provided'} variant="list" />

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
