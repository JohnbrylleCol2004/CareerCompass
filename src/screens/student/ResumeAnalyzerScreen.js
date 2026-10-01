import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Alert, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import SummaryCard from '../../components/SummaryCard';
import { colors } from '../../theme/colors';

export default function ResumeAnalyzerScreen() {
  const [resume, setResume] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  function analyzeResume() {
    if (!resume.trim()) {
      Alert.alert('Missing Resume', 'Please enter your resume details.');
      return;
    }

    setAnalyzed(true);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resume Builder and Analyzer</Text>

      <TextInput
        style={styles.resumeInput}
        placeholder="Paste your resume information here..."
        value={resume}
        onChangeText={setResume}
        multiline
      />

      <PrimaryButton
        title="Analyze Resume"
        onPress={analyzeResume}
      />

      {analyzed && (
        <>
          <SummaryCard
            title="Overall Resume Score"
            value="78%"
            description="Your resume has a good foundation."
          />

          <SummaryCard
            title="Recommendations"
            description="Add more projects, technical skills, and measurable achievements."
          />
        </>
      )}
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
    marginBottom: 18,
  },
  resumeInput: {
    minHeight: 220,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    textAlignVertical: 'top',
  },
});