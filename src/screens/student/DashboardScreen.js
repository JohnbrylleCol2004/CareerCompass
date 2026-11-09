import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/AppHeader';
import SummaryCard from '../../components/SummaryCard';
import { colors } from '../../theme/colors';
import { careers, electives, skills } from '../../data/mockData';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();

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
        <AppHeader
          title="Student Dashboard"
          onProfilePress={() => navigation.navigate('Profile')}
        />

        <Text style={styles.heading}>
          Welcome, {user?.first_name || user?.username || 'Student'}!
        </Text>

        <SummaryCard
          title="Sample Skill Gap"
          value={`${skills.length} Skills`}
          description="Explore example skills and improvement areas."
          onPress={() => navigation.navigate('Skill Gap')}
        />

        <SummaryCard
          title="BSIT Career Paths"
          value={`${careers.length} Roles`}
          description="Explore primary and secondary job roles for BSIT."
          onPress={() => navigation.navigate('Careers')}
        />

        <SummaryCard
          title="BSIT Recommended Electives"
          value={`${electives.length} Courses`}
          description="View the courses in the BSIT sample curriculum."
          onPress={() => navigation.navigate('ElectiveRecommendations')}
        />

        <SummaryCard
          title="Interview Coach"
          description="Practice common career interview questions."
          onPress={() => navigation.navigate('InterviewCoach')}
        />

        <SummaryCard
          title="Resume Analyzer"
          description="Check your resume and identify missing skills."
          onPress={() => navigation.navigate('ResumeAnalyzer')}
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
    paddingBottom: 20,
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    margin: 16,
  },
});
