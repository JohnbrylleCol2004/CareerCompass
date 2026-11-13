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
import { bsitInterviewQuestions } from '../../data/bsitInterviewQuestions';
import { requireTwentyQuestions } from '../../data/interviewQuestionSet.mjs';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { requestCareerAi } from '../../services/careerAiService';
import SummaryCard from '../../components/SummaryCard';
import AiFeedbackCard from '../../components/AiFeedbackCard';
import ResultReveal from '../../components/ResultReveal';
import { useAssessment } from '../../context/AssessmentContext';
import { isCompleteSet } from '../../data/careerAssessment.mjs';

export default function InterviewCoachScreen({ navigation }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState(bsitInterviewQuestions);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);
  const busy = useRef(false);
  const { user } = useAuth();
  const { result: assessment, saveAssessment } = useAssessment();
  const { requireConnection } = useNetwork();
  const headerHeight = useHeaderHeight();
  const question = questions[questionIndex];
  const answer = answers[questionIndex] || '';
  const result = feedback[questionIndex];
  const answerSet = questions.map((item, index) => ({ question: item.question, answer: answers[index] || '' }));
  const completed = isCompleteSet(answerSet);

  async function runAi(action) {
    if (busy.current || !requireConnection()) return;
    busy.current = true;
    setLoading(action);
    setError('');
    try {
      const data = await requestCareerAi({ action,
        ...(action === 'interview_feedback' ? { question: question.question, answer } : {}),
        ...(action === 'career_assessment' ? { answers: answerSet } : {}) });
      if (action === 'interview_questions') {
        const generatedQuestions = requireTwentyQuestions(data.questions);
        setQuestions(generatedQuestions);
        setQuestionIndex(0);
        setAnswers({});
        setFeedback({});
        setGenerated(true);
      } else if (action === 'career_assessment') {
        await saveAssessment(data);
      } else setFeedback(previous => ({ ...previous, [questionIndex]: data }));
    } catch (err) { setError(err?.message || 'Unable to connect to AI. Please try again.'); }
    finally { busy.current = false; setLoading(''); }
  }

  function nextQuestion() {
    setQuestionIndex(current => Math.min(current + 1, questions.length - 1));
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
            <Text style={styles.note}>Generating questions shares your program, career target, interests, and technologies with the Google AI service. Requesting feedback shares that answer. Avoid private information. Free-tier inputs may be used to improve Google products; use sample data for testing. Answers stay on this screen. A completed assessment saves only area ratings and short evidence notes on this device.</Text>
            <PrimaryButton title={generated ? 'Generate 20 New AI Questions' : 'Generate 20 AI Questions'}
              variant="secondary"
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
              maxLength={1200}
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

            {result && <ResultReveal>
              <SummaryCard title="Practice score" value={`${result.score}/10`} description={result.summary} />
              <AiFeedbackCard title="Strengths" items={result.strengths} />
              <AiFeedbackCard title="Ways to improve" items={result.improvements} />
              <SummaryCard title="Example improved answer" description={result.sampleAnswer} />
              <Text style={styles.note}>AI feedback can be inaccurate. Adapt examples to your real experience.</Text>
            </ResultReveal>}

            <PrimaryButton title="Previous Question" variant="secondary" disabled={!!loading || questionIndex === 0}
              onPress={() => { setQuestionIndex(questionIndex - 1); setError(''); }} />

            <PrimaryButton
              title="Next Question"
              variant="secondary"
              onPress={nextQuestion}
              disabled={!!loading || questionIndex === questions.length - 1}
            />
            {questionIndex === questions.length - 1 && <>
              <Text style={styles.note}>Answer all 20 questions to review them together. This sends the questions and answers to the Google AI service once. Results are practice guidance, not verified skill or hiring scores.</Text>
              <PrimaryButton title="Assess answers for Skill Gap and Careers"
                loading={loading === 'career_assessment'} disabled={!!loading || !completed}
                onPress={() => runAi('career_assessment')} />
              {!completed && <Text style={styles.note}>Complete every answer (up to 1,200 characters each) to enable the assessment.</Text>}
              {!!assessment && <PrimaryButton title="View Skill Gap" variant="secondary"
                onPress={() => navigation.navigate('StudentTabs', { screen: 'Skill Gap' })} />}
            </>}
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
