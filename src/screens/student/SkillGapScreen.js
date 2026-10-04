import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';

import AppHeader from '../../components/AppHeader';
import ProgressBar from '../../components/ProgressBar';
import { skills } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function SkillGapScreen() {
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
        <AppHeader title="Skill Gap Analysis" />

        <Text style={styles.title}>
          Skill Gap Indicators
        </Text>

        {skills.map((skill) => (
          <ProgressBar
            key={skill.id}
            label={skill.name}
            current={skill.currentScore}
            required={skill.requiredScore}
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
    paddingBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    marginVertical: 15,
  },
});