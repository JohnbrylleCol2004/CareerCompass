INSERT INTO users (
  id,
  name,
  username,
  email,
  password_hash,
  role
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Juan Dela Cruz',
  'juan123',
  'juan@example.com',
  'demo_password_hash',
  'student'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Career Compass Admin',
  'admin',
  'admin@careercompass.com',
  'demo_admin_password_hash',
  'admin'
);

INSERT INTO student_profiles (
  user_id,
  academic_year,
  experience_level,
  current_career,
  interests,
  technologies
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '1st Year',
  'Entry Level',
  'Web Developer',
  ARRAY['Web Development', 'Networking'],
  ARRAY['HTML', 'CSS', 'JavaScript']
);

INSERT INTO careers (
  name,
  description,
  match_score
) VALUES
(
  'Web Developer',
  'Creates and maintains websites and web applications.',
  88
),
(
  'Data Analyst',
  'Collects, analyzes, and interprets data for decision-making.',
  75
),
(
  'Cloud Engineer',
  'Manages cloud infrastructure and deployment systems.',
  74
),
(
  'Cybersecurity Analyst',
  'Protects systems, networks, and data from security threats.',
  68
);

INSERT INTO skills (
  name,
  category,
  current_score,
  required_score,
  default_weight
) VALUES
('Programming', 'Technical Core', 95, 80, 0.40),
('Web Development', 'Technical Core', 87, 75, 0.30),
('Database Management', 'Data Systems', 82, 70, 0.20),
('Version Control', 'Collaboration', 60, 70, 0.05),
('Deployment', 'Infrastructure', 55, 60, 0.05),
('Networking', 'Infrastructure', 78, 75, 0.10),
('Cybersecurity', 'Security', 70, 80, 0.15);

INSERT INTO career_skills (
  career_id,
  skill_id,
  required_score
) VALUES
(1, 1, 80),
(1, 2, 75),
(1, 3, 70),
(1, 4, 70),
(1, 5, 60),
(2, 1, 75),
(2, 3, 80),
(2, 6, 70),
(3, 5, 80),
(3, 6, 80),
(3, 7, 75),
(4, 6, 85),
(4, 7, 90);

INSERT INTO electives (
  name,
  description,
  mapped_skills,
  skill_boost
) VALUES
(
  'Advanced Web Systems',
  'Improves web development, system design, and application skills.',
  ARRAY['Web Development', 'Programming'],
  '+5% Web Development, +5% System Design'
),
(
  'DevOps Fundamentals',
  'Introduces deployment, automation, and version control practices.',
  ARRAY['Deployment', 'Version Control'],
  '+10% Deployment, +5% Version Control'
),
(
  'Cloud Deployment Basics',
  'Introduces cloud hosting and application deployment.',
  ARRAY['Deployment', 'Networking'],
  '+10% Deployment, +5% Networking'
),
(
  'RESTful API Development',
  'Teaches API design, integration, and backend communication.',
  ARRAY['Programming', 'Database Management'],
  '+10% API Integration, +5% Backend Fundamentals'
);

INSERT INTO interview_questions (
  career,
  question,
  sample_answer
) VALUES
(
  'Web Developer',
  'Explain the difference between client-side and server-side rendering.',
  'Client-side rendering happens in the browser, while server-side rendering happens on the server.'
),
(
  'Web Developer',
  'What is an API and how is it used?',
  'An API allows different applications or systems to communicate and exchange data.'
),
(
  'Web Developer',
  'What is version control?',
  'Version control tracks changes in code and allows developers to collaborate safely.'
),
(
  'Web Developer',
  'What is responsive web design?',
  'Responsive web design allows websites to adjust to different screen sizes and devices.'
);

INSERT INTO projects (
  user_id,
  name,
  status
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Personal Portfolio Website',
  'Completed'
),
(
  '11111111-1111-1111-1111-111111111111',
  'REST API Integration Project',
  'In Progress'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Student Career Compass App',
  'Completed'
);

INSERT INTO academic_records (
  user_id,
  subject,
  grade
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Programming',
  '95-100'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Web Development',
  '85-89'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Database Management',
  '80-84'
),
(
  '11111111-1111-1111-1111-111111111111',
  'Networking',
  '75-79'
);

INSERT INTO resume_analyses (
  user_id,
  overall_score,
  strengths,
  missing_skills,
  recommendations
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  78,
  ARRAY[
    'Has basic programming experience',
    'Includes web development projects'
  ],
  ARRAY[
    'Version Control',
    'Deployment',
    'RESTful API Development'
  ],
  ARRAY[
    'Add more technical projects',
    'Include measurable achievements',
    'Add Git and GitHub experience'
  ]
);

INSERT INTO specializations (
  career_id,
  name,
  required_skills,
  recommended_electives
) VALUES
(
  1,
  'Frontend Developer',
  ARRAY['HTML', 'CSS', 'JavaScript', 'UI/UX Principles'],
  ARRAY['Advanced Web Systems', 'RESTful API Development']
),
(
  1,
  'Backend Developer',
  ARRAY['Node.js', 'Database Management', 'RESTful APIs'],
  ARRAY['RESTful API Development', 'DevOps Fundamentals']
),
(
  1,
  'Full Stack Developer',
  ARRAY['Frontend Development', 'Backend Development'],
  ARRAY['Advanced Web Systems', 'Cloud Deployment Basics']
);