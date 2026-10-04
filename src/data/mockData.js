export const mockUser = {
  id: 1,
  name: 'Juan Dela Cruz',
  username: 'juan123',
  email: 'juan@example.com',
  role: 'student',
  academicYear: '1st Year',
  experienceLevel: 'Entry Level',
  currentCareer: 'Web Developer',
  interests: ['Web Development', 'Networking'],
  technologies: ['HTML', 'CSS', 'JavaScript'],
};


export const careers = [
  {
    id: 1,
    name: 'Web Developer',
    description: 'Creates and maintains websites and web applications.',
    matchScore: 88,
    requiredSkills: [
      'Programming',
      'Web Development',
      'Database Management',
      'Version Control',
      'Deployment',
    ],
  },
  {
    id: 2,
    name: 'Data Analyst',
    description: 'Collects, analyzes, and interprets data for decision-making.',
    matchScore: 75,
    requiredSkills: [
      'Programming',
      'Database Management',
      'Data Analysis',
      'Statistics',
    ],
  },
  {
    id: 3,
    name: 'Cloud Engineer',
    description: 'Manages cloud infrastructure and deployment systems.',
    matchScore: 74,
    requiredSkills: [
      'Networking',
      'Cybersecurity',
      'Deployment',
      'Cloud Computing',
    ],
  },
  {
    id: 4,
    name: 'Cybersecurity Analyst',
    description: 'Protects systems, networks, and data from security threats.',
    matchScore: 68,
    requiredSkills: [
      'Cybersecurity',
      'Networking',
      'Risk Management',
      'System Security',
    ],
  },
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

export const electives = [
  {
    id: 1,
    name: 'Advanced Web Systems',
    description:
      'Improves web development, system design, and application skills.',
    mappedSkills: ['Web Development', 'Programming'],
    skillBoost: '+5% Web Development, +5% System Design',
  },
  {
    id: 2,
    name: 'DevOps Fundamentals',
    description:
      'Introduces deployment, automation, and version control practices.',
    mappedSkills: ['Deployment', 'Version Control'],
    skillBoost: '+10% Deployment, +5% Version Control',
  },
  {
    id: 3,
    name: 'Cloud Deployment Basics',
    description:
      'Introduces cloud hosting, infrastructure, and application deployment.',
    mappedSkills: ['Deployment', 'Networking'],
    skillBoost: '+10% Deployment, +5% Networking',
  },
  {
    id: 4,
    name: 'RESTful API Development',
    description:
      'Teaches API design, integration, and backend communication.',
    mappedSkills: ['Programming', 'Database Management'],
    skillBoost: '+10% API Integration, +5% Backend Fundamentals',
  },
];

export const interviewQuestions = [
  {
    id: 1,
    career: 'Web Developer',
    question:
      'Explain the difference between client-side and server-side rendering.',
    sampleAnswer:
      'Client-side rendering happens in the browser, while server-side rendering happens on the server before the page is sent to the browser.',
  },
  {
    id: 2,
    career: 'Web Developer',
    question: 'What is an API and how is it used?',
    sampleAnswer:
      'An API allows different applications or systems to communicate and exchange data.',
  },
  {
    id: 3,
    career: 'Web Developer',
    question: 'What is version control?',
    sampleAnswer:
      'Version control tracks changes in code and allows developers to collaborate safely.',
  },
  {
    id: 4,
    career: 'Web Developer',
    question: 'What is the purpose of a database?',
    sampleAnswer:
      'A database stores, organizes, and manages information so applications can access it efficiently.',
  },
  {
    id: 5,
    career: 'Web Developer',
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
    career: 'Web Developer',
    name: 'Frontend Developer',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'UI/UX Principles'],
    recommendedElectives: [
      'Advanced Web Systems',
      'RESTful API Development',
    ],
  },
  {
    id: 2,
    career: 'Web Developer',
    name: 'Backend Developer',
    requiredSkills: [
      'Node.js',
      'Database Management',
      'RESTful APIs',
    ],
    recommendedElectives: [
      'RESTful API Development',
      'DevOps Fundamentals',
    ],
  },
  {
    id: 3,
    career: 'Web Developer',
    name: 'Full Stack Developer',
    requiredSkills: [
      'Frontend Development',
      'Backend Development',
      'Database Management',
    ],
    recommendedElectives: [
      'Advanced Web Systems',
      'Cloud Deployment Basics',
    ],
  },
];