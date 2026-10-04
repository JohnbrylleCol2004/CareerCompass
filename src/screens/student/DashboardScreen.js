import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';

import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/AppHeader';
import SummaryCard from '../../components/SummaryCard';
import { colors } from '../../theme/colors';
import { careers, skills } from '../../data/mockData';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();

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
        <AppHeader
          title="Student Dashboard"
          onProfilePress={() => navigation.navigate('Profile')}
        />

        <Text style={styles.heading}>
          Welcome, {user?.name || 'Student'}!
        </Text>

        <SummaryCard
          title="Skill Gap Summary"
          value={`${skills.length} Skills`}
          description="Review your current skills and improvement areas."
          onPress={() => navigation.navigate('Skill Gap')}
        />

        <SummaryCard
          title="Top Career Match"
          value={`${careers[0].matchScore}%`}
          description={careers[0].name}
          onPress={() => navigation.navigate('Careers')}
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