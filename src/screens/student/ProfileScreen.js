import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ScrollView, Text, StyleSheet } from 'react-native';
import AppHeader from '../../components/AppHeader';
import SummaryCard from '../../components/SummaryCard';
import PrimaryButton from '../../components/PrimaryButton';
import { mockUser } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();
  
  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Student Profile" />

      <SummaryCard title="Name" value={mockUser.name} />
      <SummaryCard title="Academic Year" value={mockUser.academicYear} />
      <SummaryCard title="Experience Level" value={mockUser.experienceLevel} />
      <SummaryCard title="Career Target" value={mockUser.currentCareer} />
      <SummaryCard
        title="Interests"
        description={mockUser.interests.join(', ')}
      />
      <SummaryCard
        title="Technologies"
        description={mockUser.technologies.join(', ')}
      />

      <PrimaryButton
        title="Edit Profile"
        onPress={() => navigation.navigate('EditProfile')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 20,
  },
});