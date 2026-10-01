import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import SummaryCard from '../../components/SummaryCard';
import { skills } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function SkillRequirementsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Skill Requirements</Text>

      {skills.map((skill) => (
        <SummaryCard
          key={skill.id}
          title={skill.name}
          value={`Required: ${skill.requiredScore}%`}
          description={`Current default score: ${skill.currentScore}%`}
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