import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

import PrimaryButton from '../../components/PrimaryButton';
import { interviewQuestions } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { requestCareerAi } from '../../services/careerAiService';
import SummaryCard from '../../components/SummaryCard';
import AiFeedbackCard from '../../components/AiFeedbackCard';

export default function InterviewCoachScreen() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState(interviewQuestions);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);
  const busy = useRef(false);
  const { user } = useAuth();
  const { requireConnection } = useNetwork();
  const headerHeight = useHeaderHeight();
  const question = questions[questionIndex];
  const answer = answers[questionIndex] || '';
  const result = feedback[questionIndex];

  async function runAi(action) {
    if (busy.current || !requireConnection()) return;
    busy.current = true;
    setLoading(action);
    setError('');
    try {
      const data = await requestCareerAi({ action,
        ...(action === 'interview_feedback' ? { question: question.question, answer } : {}) });
      if (action === 'interview_questions') {
        setQuestions(data.questions);
        setQuestionIndex(0);
        setAnswers({});
        setFeedback({});
        setGenerated(true);
      } else setFeedback(previous => ({ ...previous, [questionIndex]: data }));
    } catch (err) { setError(err?.message || 'Unable to connect to AI. Please try again.'); }
    finally { busy.current = false; setLoading(''); }
  }

  function nextQuestion() {
    setQuestionIndex((questionIndex + 1) % questions.length);
    setError('');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
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
          <View>
            <Text style={styles.title}>
              Interview Coach
            </Text>

            <Text style={styles.note}>Practice for {user?.program || 'your program'}{user?.career_target ? ` · ${user.career_target}` : ''}.</Text>
            <Text style={styles.note}>Generating questions shares your program, career target, interests, and technologies with Google Gemini. Requesting feedback also shares your answer. Avoid private information. Free-tier inputs may be used to improve Google products; use sample data for testing. Practice is kept only while this screen is open.</Text>
            <PrimaryButton title={generated ? 'Generate New AI Questions' : 'Generate 5 AI Questions'}
              loading={loading === 'interview_questions'} disabled={!!loading}
              onPress={() => runAi('interview_questions')} />
            <Text style={styles.note}>{generated ? 'AI-generated questions' : 'Built-in practice questions · available offline'}</Text>
            {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}

            <Text style={styles.counter}>
              Question {questionIndex + 1} of{' '}
              {questions.length}
            </Text>

            <Text style={styles.question}>
              {question.question}
            </Text>

            <TextInput
              style={styles.answer}
              placeholder="Type your answer here..."
              placeholderTextColor={colors.gray}
              value={answer}
              accessibilityLabel="Your interview answer"
              editable={!loading}
              maxLength={6000}
              onChangeText={text => {
                setAnswers(previous => ({ ...previous, [questionIndex]: text }));
                setFeedback(previous => ({ ...previous, [questionIndex]: undefined }));
              }}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.buttonSpacing}>
              <PrimaryButton
                title="Get AI Feedback"
                loading={loading === 'interview_feedback'}
                disabled={!!loading || !answer.trim()}
                onPress={() => runAi('interview_feedback')}
              />
            </View>

            {result && <>
              <SummaryCard title="Practice score" value={`${result.score}/10`} description={result.summary} />
              <AiFeedbackCard title="Strengths" items={result.strengths} />
              <AiFeedbackCard title="Ways to improve" items={result.improvements} />
              <SummaryCard title="Example improved answer" description={result.sampleAnswer} />
              <Text style={styles.note}>AI feedback can be inaccurate. Adapt examples to your real experience.</Text>
            </>}

            <PrimaryButton title="Previous Question" disabled={!!loading || questionIndex === 0}
              onPress={() => { setQuestionIndex(questionIndex - 1); setError(''); }} />

            <PrimaryButton
              title="Next Question"
              onPress={nextQuestion}
              disabled={!!loading}
            />
          </View>
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
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },

  counter: {
    color: colors.gray,
    marginBottom: 20,
  },

  question: {
    backgroundColor: colors.secondary,
    padding: 18,
    fontSize: 17,
    lineHeight: 24,
    color: colors.dark,
    marginBottom: 20,
    borderRadius: 8,
  },

  answer: {
    minHeight: 140,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: colors.dark,
    textAlignVertical: 'top',
    marginBottom: 16,
  },

  buttonSpacing: {
    marginBottom: 12,
  },
  note: { color: colors.gray, fontSize: 14, lineHeight: 21, marginVertical: 8 },
  error: { color: colors.danger, fontSize: 15, lineHeight: 22, marginVertical: 12 },
});
