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
