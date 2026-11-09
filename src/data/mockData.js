export const mockUser = {
  id: 1,
  name: 'Juan Dela Cruz',
  username: 'juan123',
  email: 'juan@example.com',
  role: 'student',
  program: 'BSIT',
  academicYear: '1st Year',
  experienceLevel: 'Entry Level',
  currentCareer: 'Web and Applications Developer',
  interests: ['Web Development', 'Networking'],
  technologies: ['HTML', 'CSS', 'JavaScript'],
};


// Roles listed for BSIT in the curriculum reference supplied by the user.
export const careers = [
  { id: 1, name: 'Web and Applications Developer', tier: 'primary' },
  { id: 2, name: 'Junior Database Administrator', tier: 'primary' },
  { id: 3, name: 'Systems Administrator', tier: 'primary' },
  { id: 4, name: 'Network Engineer', tier: 'primary' },
  { id: 5, name: 'Junior Information Security Administrator', tier: 'primary' },
  { id: 6, name: 'Systems Integration Personnel', tier: 'primary' },
  { id: 7, name: 'IT Audit Assistant', tier: 'primary' },
  { id: 8, name: 'Technical Support Specialist', tier: 'primary' },
  { id: 9, name: 'QA Specialist', tier: 'secondary' },
  { id: 10, name: 'Systems Analyst', tier: 'secondary' },
  { id: 11, name: 'Computer Programmer', tier: 'secondary' },
];

export const skills = [
  {
    id: 1,
    name: 'Programming',
    category: 'Technical Core',
    currentScore: 95,
    requiredScore: 80,
    defaultWeight: 0.4,
  },
  {
    id: 2,
    name: 'Web Development',
    category: 'Technical Core',
    currentScore: 87,
    requiredScore: 75,
    defaultWeight: 0.3,
  },
  {
    id: 3,
    name: 'Database Management',
    category: 'Data Systems',
    currentScore: 82,
    requiredScore: 70,
    defaultWeight: 0.2,
  },
  {
    id: 4,
    name: 'Version Control',
    category: 'Collaboration',
    currentScore: 60,
    requiredScore: 70,
    defaultWeight: 0.05,
  },
  {
    id: 5,
    name: 'Deployment',
    category: 'Infrastructure',
    currentScore: 55,
    requiredScore: 60,
    defaultWeight: 0.05,
  },
  {
    id: 6,
    name: 'Networking',
    category: 'Infrastructure',
    currentScore: 78,
    requiredScore: 75,
    defaultWeight: 0.1,
  },
  {
    id: 7,
    name: 'Cybersecurity',
    category: 'Security',
    currentScore: 70,
    requiredScore: 80,
    defaultWeight: 0.15,
  },
];

// Recommended elective rows from the BSIT curriculum excerpt supplied by the user.
export const electives = [
  { id: 1, code: 'IPT102', name: 'Integrative Programming Technologies 2' },
  { id: 2, code: 'PT101', name: 'Platform Technologies' },
  { id: 3, code: 'WS101', name: 'Web Systems and Technologies' },
  { id: 4, code: 'PF101', name: 'Object-Oriented Programming' },
  { id: 5, code: 'SIA102', name: 'Systems Integration and Architecture 2' },
  { id: 6, code: 'HCI102', name: 'Human Computer Interaction 2' },
];

export const interviewQuestions = [
  {
    id: 1,
    career: 'Web and Applications Developer',
    question:
      'Explain the difference between client-side and server-side rendering.',
    sampleAnswer:
      'Client-side rendering happens in the browser, while server-side rendering happens on the server before the page is sent to the browser.',
  },
  {
    id: 2,
    career: 'Web and Applications Developer',
    question: 'What is an API and how is it used?',
    sampleAnswer:
      'An API allows different applications or systems to communicate and exchange data.',
  },
  {
    id: 3,
    career: 'Web and Applications Developer',
    question: 'What is version control?',
    sampleAnswer:
      'Version control tracks changes in code and allows developers to collaborate safely.',
  },
  {
    id: 4,
    career: 'Web and Applications Developer',
    question: 'What is the purpose of a database?',
    sampleAnswer:
      'A database stores, organizes, and manages information so applications can access it efficiently.',
  },
  {
    id: 5,
    career: 'Web and Applications Developer',
    question: 'What is responsive web design?',
    sampleAnswer:
      'Responsive web design allows websites to adjust properly to different screen sizes and devices.',
  },
  {
    id: 6,
    career: 'Web and Applications Developer',
    question: 'How would you make a web form easier to use with a keyboard and screen reader?',
    sampleAnswer:
      'I would use clear labels, logical focus order, visible focus states, and errors that explain how to correct each field.',
  },
  {
    id: 7,
    career: 'Web and Applications Developer',
    question: 'What work belongs in the frontend, and what work belongs in the backend?',
    sampleAnswer:
      'The frontend presents and collects information, while the backend handles trusted operations such as data access and authorization.',
  },
  {
    id: 8,
    career: 'Web and Applications Developer',
    question: 'How would you investigate a page that fails to load data from an API?',
    sampleAnswer:
      'I would check the request URL, network status, response code, authentication, and server logs, then reproduce the failure with a small request.',
  },
  {
    id: 9,
    career: 'Web and Applications Developer',
    question: 'Why should an application use parameterized database queries?',
    sampleAnswer:
      'Parameterized queries separate user input from SQL commands, helping prevent SQL injection and making queries safer.',
  },
  {
    id: 10,
    career: 'Web and Applications Developer',
    question: 'What is the difference between an HTTP GET request and a POST request?',
    sampleAnswer:
      'GET retrieves a resource. POST sends data for the server to process or create a resource, depending on the API.',
  },
  {
    id: 11,
    career: 'Web and Applications Developer',
    question: 'How should passwords be handled in a web application?',
    sampleAnswer:
      'Passwords should be sent over HTTPS and stored only as strong salted password hashes, never as plain text.',
  },
  {
    id: 12,
    career: 'Web and Applications Developer',
    question: 'What would you do if your code changes conflict with a teammate’s changes?',
    sampleAnswer:
      'I would review both changes, discuss the intended behavior with my teammate, resolve the conflict, and run the relevant checks.',
  },
  {
    id: 13,
    career: 'Web and Applications Developer',
    question: 'What kinds of tests would you write for a registration form?',
    sampleAnswer:
      'I would test required fields, invalid input, successful submission, server errors, and whether users can complete the form with assistive input.',
  },
  {
    id: 14,
    career: 'Web and Applications Developer',
    question: 'How would you approach a bug that appears only after deployment?',
    sampleAnswer:
      'I would reproduce it in the deployed environment, compare configuration and logs, identify the smallest cause, and verify the fix there.',
  },
  {
    id: 15,
    career: 'Web and Applications Developer',
    question: 'Name two ways to improve the loading speed of a web page.',
    sampleAnswer:
      'I could reduce image sizes and unnecessary JavaScript, then measure the result to see which change helped.',
  },
  {
    id: 16,
    career: 'Web and Applications Developer',
    question: 'What would you ask before building a feature from an unclear request?',
    sampleAnswer:
      'I would ask who will use it, what task they need to complete, what success looks like, and any important constraints.',
  },
  {
    id: 17,
    career: 'Web and Applications Developer',
    question: 'Tell me about a time you disagreed with a teammate about a technical decision.',
    sampleAnswer:
      'I would describe the situation, the options we considered, how we tested or discussed them, and what we learned from the outcome.',
  },
  {
    id: 18,
    career: 'Web and Applications Developer',
    question: 'How do you learn a technology you have not used before?',
    sampleAnswer:
      'I start with official documentation, build a small example, ask questions when stuck, and apply what I learn to a real task.',
  },
  {
    id: 19,
    career: 'Web and Applications Developer',
    question: 'How would you prioritize a critical bug while working toward a deadline?',
    sampleAnswer:
      'I would assess the impact, tell the team what is at risk, fix the highest-impact issue first, and adjust the plan openly.',
  },
  {
    id: 20,
    career: 'Web and Applications Developer',
    question: 'How would you explain a technical problem to someone without a technical background?',
    sampleAnswer:
      'I would describe the user impact in plain language, explain the next step, and check that the person understands the update.',
  },
];

export const resumeAnalysis = {
  overallScore: 78,
  strengths: [
    'Has basic programming experience',
    'Includes web development projects',
    'Lists HTML, CSS, and JavaScript skills',
  ],
  missingSkills: [
    'Version Control',
    'Deployment',
    'RESTful API Development',
  ],
  recommendations: [
    'Add more technical projects',
    'Include measurable achievements',
    'Add Git and GitHub experience',
    'Include deployment experience',
  ],
};

export const academicRecords = [
  {
    subject: 'Cloud Computing',
    grade: '75-79',
  },
  {
    subject: 'Cybersecurity',
    grade: '80-84',
  },
  {
    subject: 'Data Science',
    grade: 'Below 75',
  },
  {
    subject: 'Database Management',
    grade: '80-84',
  },
  {
    subject: 'Networking',
    grade: '75-79',
  },
  {
    subject: 'Programming',
    grade: '95-100',
  },
  {
    subject: 'Web Development',
    grade: '85-89',
  },
];

export const projects = [
  {
    id: 1,
    name: 'Personal Portfolio Website',
    status: 'Completed',
  },
  {
    id: 2,
    name: 'REST API Integration Project',
    status: 'In Progress',
  },
  {
    id: 3,
    name: 'Student Career Compass App',
    status: 'Completed',
  },
];

export const specializations = [
  {
    id: 1,
    career: 'Web and Applications Developer',
    name: 'Frontend Developer',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'UI/UX Principles'],
    recommendedElectives: [
      'Web Systems and Technologies',
      'Human Computer Interaction 2',
    ],
  },
  {
    id: 2,
    career: 'Web and Applications Developer',
    name: 'Backend Developer',
    requiredSkills: [
      'Node.js',
      'Database Management',
      'RESTful APIs',
    ],
    recommendedElectives: [
      'Integrative Programming Technologies 2',
      'Object-Oriented Programming',
    ],
  },
  {
    id: 3,
    career: 'Web and Applications Developer',
    name: 'Full Stack Developer',
    requiredSkills: [
      'Frontend Development',
      'Backend Development',
      'Database Management',
    ],
    recommendedElectives: [
      'Web Systems and Technologies',
      'Integrative Programming Technologies 2',
    ],
  },
];
