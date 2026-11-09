import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import StudentMenuHeader from '../../components/StudentMenuHeader';
import PrimaryButton from '../../components/PrimaryButton';
import SummaryCard from '../../components/SummaryCard';
import { useAssessment } from '../../context/AssessmentContext';
import { AREAS } from '../../data/careerAssessment.mjs';
import { colors } from '../../theme/colors';

export default function SkillGapScreen({ navigation }) {
  const { result, loading } = useAssessment();
  const byArea = Object.fromEntries((result?.areas || []).map(item => [item.area, item]));
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StudentMenuHeader title="Skill Gap Analysis" current="Skill Gap" navigation={navigation} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Skill Gap</Text>
        {loading ? <Text style={styles.note}>Loading your assessment…</Text> : !result ? <>
          <Text style={styles.note}>Complete all 20 Interview Coach questions to see practice-based skill findings here.</Text>
          <PrimaryButton title="Open Interview Coach" onPress={() => navigation.navigate('InterviewCoach')} />
        </> : <>
          <Text style={styles.note}>Based on your completed Interview Coach answers. These levels describe what your answers showed, not verified ability. “Not assessed” means there was too little evidence. Review areas marked developing or not assessed for your next practice session.</Text>
          <Text style={styles.note}>Reviewed {new Date(result.completedAt).toLocaleDateString()}</Text>
          {AREAS.map(([id, name]) => {
            const area = byArea[id];
            return <SummaryCard key={id} title={`${name} · ${area?.level || 'unassessed'}`}
              description={`${area?.note || 'No answer evidence available.'}${area?.evidence.length ? ` Questions ${area.evidence.join(', ')}.` : ''}`} />;
          })}
          <PrimaryButton title="Practice again" variant="secondary" onPress={() => navigation.navigate('InterviewCoach')} />
        </>}
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

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    marginVertical: 15,
  },
  note: { color: colors.gray, fontSize: 14, lineHeight: 21, marginBottom: 12 },
});
