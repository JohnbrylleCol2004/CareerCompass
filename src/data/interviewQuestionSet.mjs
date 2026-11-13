export function requireTwentyQuestions(questions) {
  const valid = Array.isArray(questions) && questions.length === 20
    && questions.every(item => typeof item?.question === 'string'
      && item.question.trim().length > 0 && item.question.length <= 1000);
  if (!valid || new Set(questions.map(item => item.question.trim().toLowerCase())).size !== 20) {
    throw new Error('AI must return 20 questions. Your current set is unchanged. Update the deployed career-ai-mobile function if this continues.');
  }
  return questions;
}
