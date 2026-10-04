import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import SummaryCard from '../../components/SummaryCard';
import { careers } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function CareerRecommendationScreen() {
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
        <Text style={styles.title}>
          Career Recommendations
        </Text>

        {careers.map((career) => (
          <SummaryCard
            key={career.id}
            title={career.name}
            value={`${career.matchScore}% Match`}
            description={career.description}
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
});