import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SummaryCard from '../../components/SummaryCard';
import { electives } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function ElectiveRecommendationScreen() {
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
        <Text style={styles.title}>BSIT Recommended Electives</Text>
        <Text style={styles.note}>These six courses appear under “Recommended Electives” in the BSIT sample curriculum. Check your current school catalog before enrolling.</Text>

        {electives.map((elective) => (
          <SummaryCard
            key={elective.id}
            title={elective.name}
            description={`Course code ${elective.code}`}
            variant="list"
          />
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
  note: { color: colors.gray, fontSize: 14, lineHeight: 21, marginBottom: 12 },
});
