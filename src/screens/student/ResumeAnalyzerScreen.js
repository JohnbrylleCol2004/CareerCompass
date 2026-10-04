import React, { useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import SummaryCard from '../../components/SummaryCard';
import { colors } from '../../theme/colors';

export default function ResumeAnalyzerScreen() {
  const [resume, setResume] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  function analyzeResume() {
    if (!resume.trim()) {
      Alert.alert(
        'Missing Resume',
        'Please enter your resume details.'
      );
      return;
    }

    setAnalyzed(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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

          <TextInput
            style={styles.resumeInput}
            placeholder="Paste your resume information here..."
            placeholderTextColor={colors.gray}
            value={resume}
            onChangeText={setResume}
            multiline
            textAlignVertical="top"
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardView: {
    flex: 1,
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

  resumeInput: {
    minHeight: 220,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    color: colors.dark,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
});