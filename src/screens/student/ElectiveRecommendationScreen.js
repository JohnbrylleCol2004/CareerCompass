import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';

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
        <Text style={styles.title}>
          Recommended Electives
        </Text>

        {electives.map((elective) => (
          <SummaryCard
            key={elective.id}
            title={elective.name}
            description={elective.description}
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