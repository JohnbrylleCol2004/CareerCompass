// Two prompts per area make the built-in set useful across the BSIT role catalog.
const prompts = [
  ['programming', 'How would you explain a function and its inputs to a new programmer?'],
  ['programming', 'A program gives the wrong output for one input. How would you find and fix the cause?'],
  ['web', 'What is the difference between the frontend and backend of a web application?'],
  ['web', 'How would you make a web form usable with a keyboard and a screen reader?'],
  ['database', 'When would you use a database table relationship, and why?'],
  ['database', 'How would you investigate a database query that becomes slow as data grows?'],
  ['networking', 'What happens when a user enters a website address in a browser?'],
  ['networking', 'How would you troubleshoot a computer that cannot reach a local server?'],
  ['security', 'Why should an application use multi-factor authentication and least privilege?'],
  ['security', 'You notice an exposed password in a shared repository. What steps would you take?'],
  ['systems', 'What would you check when a server runs out of disk space?'],
  ['systems', 'How would you plan a safe operating system update for a shared server?'],
  ['integration', 'What is an API, and how would you connect two systems through one?'],
  ['integration', 'Two systems disagree about a student record. How would you trace the mismatch?'],
  ['quality', 'What kinds of tests would you write for a registration form?'],
  ['quality', 'A bug appears only after deployment. How would you reproduce and report it?'],
  ['analysis', 'What would you ask before building a feature from an unclear request?'],
  ['analysis', 'How would you turn a user need into requirements a development team can verify?'],
  ['support', 'How would you explain a technical outage to someone without a technical background?'],
  ['support', 'A user says their computer is slow. How would you diagnose the problem with them?'],
];

export const bsitInterviewQuestions = prompts.map(([area, question], index) => ({
  id: index + 1,
  area,
  career: 'BSIT career exploration',
  question,
}));
