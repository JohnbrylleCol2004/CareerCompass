import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SummaryCard from '../../components/SummaryCard';
import { careers } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function CareerRecommendationScreen() {
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
        <Text style={styles.title}>BSIT Career Paths</Text>
        <Text style={styles.note}>Job roles listed in the BSIT reference you shared. These are paths to explore, not personal match scores.</Text>

        <Text style={styles.sectionTitle}>Primary job roles</Text>
        {careers.filter((career) => career.tier === 'primary').map((career) => (
          <SummaryCard
            key={career.id}
            title={career.name}
          />
        ))}
        <Text style={styles.sectionTitle}>Secondary job roles</Text>
        {careers.filter((career) => career.tier === 'secondary').map((career) => (
          <SummaryCard key={career.id} title={career.name} />
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
