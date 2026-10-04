import React, { useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import { interviewQuestions } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function InterviewCoachScreen() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');

  const question = interviewQuestions[questionIndex];

  function submitAnswer() {
    Alert.alert(
      'Answer Submitted',
      'Your answer has been recorded.'
    );
    setAnswer('');
  }

  function nextQuestion() {
    setQuestionIndex(
      (questionIndex + 1) % interviewQuestions.length
    );
    setAnswer('');
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
          <View>
            <Text style={styles.title}>
              Interview Coach
            </Text>

            <Text style={styles.counter}>
              Question {questionIndex + 1} of{' '}
              {interviewQuestions.length}
            </Text>

            <Text style={styles.question}>
              {question.question}
            </Text>

            <TextInput
              style={styles.answer}
              placeholder="Type your answer here..."
              placeholderTextColor={colors.gray}
              value={answer}
              onChangeText={setAnswer}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.buttonSpacing}>
              <PrimaryButton
                title="Submit Answer"
                onPress={submitAnswer}
              />
            </View>

            <PrimaryButton
              title="Next Question"
              onPress={nextQuestion}
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
});