import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ResumePdfInput from '../../components/ResumePdfInput';
import PrimaryButton from '../../components/PrimaryButton';
import SummaryCard from '../../components/SummaryCard';
import { colors } from '../../theme/colors';

export default function ResumeAnalyzerScreen() {
  const [resume, setResume] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  function analyzeResume() {
    if (!resume) {
      Alert.alert(
        'Missing Resume',
        'Please add a PDF resume first.'
      );
      return;
    }

    setAnalyzed(true);
  }

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
          Resume Builder and Analyzer
        </Text>

        <ResumePdfInput onSelect={file => { setResume(file); setAnalyzed(false); }} />
        {resume && (
          <>
            <Text style={styles.fileName}>{resume.name}</Text>
            <Text style={styles.fileDetails}>{Math.ceil(resume.size / 1024)} KB - PDF</Text>
            <PrimaryButton title="Remove PDF" onPress={() => { setResume(null); setAnalyzed(false); }} />
          </>
        )}
        <Text style={styles.fileDetails}>Analysis currently shows a demo result, not an evaluation of your PDF.</Text>

        <PrimaryButton
          title="Analyze Resume"
          disabled={!resume}
          onPress={analyzeResume}
        />

        {analyzed && (
          <>
            <SummaryCard
              title="Demo Resume Score"
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
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 18,
  },

  fileName: { color: colors.dark, fontSize: 16, fontWeight: '600', marginTop: 16 },
  fileDetails: { color: colors.gray, fontSize: 13, marginVertical: 8 },
});
