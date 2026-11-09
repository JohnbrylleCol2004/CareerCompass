import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';
import { useAssessment } from '../../context/AssessmentContext';
import StudentMenuHeader from '../../components/StudentMenuHeader';
import SummaryCard from '../../components/SummaryCard';
import { colors } from '../../theme/colors';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { result: assessment } = useAssessment();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StudentMenuHeader title="Student Dashboard" current="Dashboard" navigation={navigation} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.welcomeRow}>
          <Image source={require('../../../assets/careercompass_logo.png')} style={styles.logo} accessibilityLabel="CareerCompass logo" />
          <Text accessibilityRole="header" style={styles.heading}>
            Welcome, {user?.first_name || user?.username || 'Student'}!
          </Text>
        </View>

        <SummaryCard
          title="BSIT Career Paths"
          description={assessment ? 'Explore paths suggested by your interview answers and the full BSIT role list.' : 'Explore BSIT roles. Complete Interview Coach for practice-based suggestions.'}
          onPress={() => navigation.navigate('Careers')}
        />

        <SummaryCard
          title="BSIT Recommended Electives"
          description="View the courses in the BSIT sample curriculum."
          onPress={() => navigation.navigate('ElectiveRecommendations')}
        />

        <SummaryCard
          title="Skill Gap"
          description={assessment ? 'Review what your interview answers demonstrated and what needs more evidence.' : 'Answer all 20 Interview Coach questions to see practice-based skill findings.'}
          onPress={() => navigation.navigate('Skill Gap')}
        />

        <SummaryCard
          title="Interview Coach"
          description="Practice 20 BSIT questions, then assess your answers for Skill Gap and Careers."
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

  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    margin: 16,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  heading: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
  },
});
