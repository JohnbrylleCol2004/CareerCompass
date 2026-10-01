import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import SummaryCard from '../../components/SummaryCard';
import { electives } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function ElectiveRecommendationScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recommended Electives</Text>

      {electives.map((elective) => (
        <SummaryCard
          key={elective.id}
          title={elective.name}
          description={elective.description}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },
});
