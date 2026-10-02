import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';

import SummaryCard from '../../components/SummaryCard';
import { colors } from '../../theme/colors';

const specializations = [
  {
    id: 1,
    name: 'Frontend Developer',
    skills: 'HTML, CSS, JavaScript, UI/UX Principles',
  },
  {
    id: 2,
    name: 'Backend Developer',
    skills: 'Node.js, Databases, RESTful APIs',
  },
  {
    id: 3,
    name: 'Full Stack Developer',
    skills: 'Frontend and Backend Development',
  },
];

export default function SpecializationsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Specializations</Text>

      {specializations.map((item) => (
        <SummaryCard
          key={item.id}
          title={item.name}
          description={`Required Skills: ${item.skills}`}
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