import React, { useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ResumePdfInput from '../../components/ResumePdfInput';
import PrimaryButton from '../../components/PrimaryButton';
import SummaryCard from '../../components/SummaryCard';
import { colors } from '../../theme/colors';
import { useNetwork } from '../../context/NetworkContext';
import { analyzeResumePdf } from '../../services/careerAiService';
import AiFeedbackCard from '../../components/AiFeedbackCard';

export default function ResumeAnalyzerScreen() {
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const { requireConnection } = useNetwork();

  async function analyzeResume() {
    if (!resume || busy.current || !requireConnection()) return;
    busy.current = true;
    setLoading(true);
    setError('');
    setAnalysis(null);
    try { setAnalysis(await analyzeResumePdf(resume)); }
    catch (err) { setError(err?.message || 'Unable to analyze this PDF. Please try again.'); }
    finally { busy.current = false; setLoading(false); }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
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
          Resume Analyzer
        </Text>

        <ResumePdfInput disabled={loading} onSelect={file => { setResume(file); setAnalysis(null); setError(''); }} />
        {resume && (
          <>
            <Text style={styles.fileName}>{resume.name}</Text>
            <Text style={styles.fileDetails}>{Math.ceil(resume.size / 1024)} KB - PDF</Text>
            <PrimaryButton title="Remove PDF" disabled={loading} onPress={() => { setResume(null); setAnalysis(null); setError(''); }} />
          </>
        )}
        <Text style={styles.fileDetails}>Tapping Analyze sends your PDF and career profile context to Google Gemini for review. For free-tier testing, use a sample resume: inputs may be used to improve Google products. Your PDF and analysis are not saved to our database.</Text>

        <PrimaryButton
          title="Analyze Resume"
          disabled={!resume || loading}
          loading={loading}
          onPress={analyzeResume}
        />

        {loading && <Text style={styles.fileDetails}>Reading your PDF and preparing feedback. This may take a minute.</Text>}
        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        {analysis && (
          <>
            <SummaryCard title={analysis.isResume ? 'Resume quality score' : 'Document needs attention'}
              value={analysis.isResume ? `${analysis.score}/100` : undefined} description={analysis.summary} />
            {analysis.isResume && <>
              <AiFeedbackCard title="Strengths" items={analysis.strengths} />
              <AiFeedbackCard title="Recommended improvements" items={analysis.improvements} />
              <AiFeedbackCard title="Missing sections" items={analysis.missingSections} />
              <AiFeedbackCard title="Skills found in your PDF" items={analysis.skills} />
              <AiFeedbackCard title="Roles to explore" items={analysis.suggestedRoles} />
              <SummaryCard title="Example improved bullet" description={analysis.exampleBullet} />
            </>}
            <Text style={styles.fileDetails}>AI feedback can be inaccurate. This score is practice guidance, not an ATS score or a hiring prediction. Review suggestions before using them.</Text>
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
  error: { color: colors.danger, fontSize: 15, lineHeight: 22, marginVertical: 12 },
});
