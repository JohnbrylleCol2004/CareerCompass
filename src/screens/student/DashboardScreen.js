import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ScrollView, Text, StyleSheet } from 'react-native';
import AppHeader from '../../components/AppHeader';
import SummaryCard from '../../components/SummaryCard';
import { colors } from '../../theme/colors';
import { careers, skills } from '../../data/mockData';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  
  return (
    <ScrollView style={styles.container}>
      <AppHeader
        title="Student Dashboard"
        onProfilePress={() => navigation.navigate('Profile')}
      />

      <Text style={styles.heading}> Welcome, {user?.name || 'Student'}!
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    margin: 16,
  },
});