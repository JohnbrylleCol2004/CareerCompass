import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SummaryCard from '../../components/SummaryCard';
import StudentMenuHeader from '../../components/StudentMenuHeader';
import PrimaryButton from '../../components/PrimaryButton';
import { useAssessment } from '../../context/AssessmentContext';
import { AREAS, rankCareers } from '../../data/careerAssessment.mjs';
import { careers } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function CareerRecommendationScreen({ navigation }) {
  const { result, loading } = useAssessment();
  const suggestions = result ? rankCareers(result) : [];
  const names = Object.fromEntries(AREAS);
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StudentMenuHeader title="Careers" current="Careers" navigation={navigation} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>BSIT Career Paths</Text>
        {loading ? <Text style={styles.note}>Loading your assessment…</Text> : !result ? <>
          <Text style={styles.note}>Complete all 20 Interview Coach questions to see paths suggested by your answers.</Text>
          <PrimaryButton title="Open Interview Coach" onPress={() => navigation.navigate('InterviewCoach')} />
        </> : <>
          <Text style={styles.sectionTitle}>Paths to explore</Text>
          <Text style={styles.note}>Suggested from your interview practice evidence. This is not a hiring prediction or a verified measure of ability. Roles with too little evidence are left out.</Text>
          {suggestions.length ? suggestions.map(role => {
            const questionNumbers = [...new Set(role.supported.flatMap(id => result.areas.find(item => item.area === id)?.evidence || []))].sort((a, b) => a - b);
            return <SummaryCard key={role.name} title={role.name}
              description={`Supported areas: ${role.supported.map(id => names[id]).join(', ')}. See questions ${questionNumbers.join(', ')} in your Skill Gap findings.`} />;
          })
            : <Text style={styles.note}>Your answers did not provide enough evidence to suggest a path yet. Try more specific technical examples in Interview Coach.</Text>}
        </>}
        <Text style={styles.sectionTitle}>All BSIT roles</Text>
        <Text style={styles.note}>Roles listed in the supplied BSIT curriculum reference. This list is available regardless of your assessment.</Text>

        <Text style={styles.sectionTitle}>Primary job roles</Text>
        {careers.filter((career) => career.tier === 'primary').map((career) => (
          <SummaryCard
            key={career.id}
            title={career.name}
            variant="list"
          />
        ))}
        <Text style={styles.sectionTitle}>Secondary job roles</Text>
        {careers.filter((career) => career.tier === 'secondary').map((career) => (
          <SummaryCard key={career.id} title={career.name} variant="list" />
        ))}
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
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },
  note: { color: colors.gray, fontSize: 14, lineHeight: 21, marginBottom: 20 },
  sectionTitle: { color: colors.dark, fontSize: 18, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
});
