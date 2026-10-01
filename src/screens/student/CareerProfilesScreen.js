import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import SummaryCard from '../../components/SummaryCard';
import { careers } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function CareerProfilesScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Career Profiles</Text>

      {careers.map((career) => (
        <SummaryCard
          key={career.id}
          title={career.name}
          description={career.description}
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