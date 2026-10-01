import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { interviewQuestions } from '../../data/mockData';
import { colors } from '../../theme/colors';

export default function InterviewCoachScreen() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');

  const question = interviewQuestions[questionIndex];

  function submitAnswer() {
    Alert.alert('Answer Submitted', 'Your answer has been recorded.');
    setAnswer('');
  }

  function nextQuestion() {
    setQuestionIndex(
      (questionIndex + 1) % interviewQuestions.length
    );
    setAnswer('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interview Coach</Text>

      <Text style={styles.counter}>
        Question {questionIndex + 1} of {interviewQuestions.length}
      </Text>

      <Text style={styles.question}>{question.question}</Text>

      <TextInput
        style={styles.answer}
        placeholder="Type your answer here..."
        value={answer}
        onChangeText={setAnswer}
        multiline
      />

      <PrimaryButton title="Submit Answer" onPress={submitAnswer} />
      <PrimaryButton title="Next Question" onPress={nextQuestion} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  },
  answer: {
    height: 140,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
});