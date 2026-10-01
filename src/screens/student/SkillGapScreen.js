import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import AppHeader from '../../components/AppHeader';
import ProgressBar from '../../components/ProgressBar';
import { skills } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function SkillGapScreen() {
  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Skill Gap Analysis" />

      <Text style={styles.title}>Skill Gap Indicators</Text>

      {skills.map((skill) => (
        <ProgressBar
          key={skill.id}
          label={skill.name}
          current={skill.currentScore}
          required={skill.requiredScore}
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
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    marginVertical: 15,
  },
});
