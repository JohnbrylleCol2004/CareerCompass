CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT,
  role VARCHAR(20) DEFAULT 'student'
    CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  academic_year VARCHAR(50),
  experience_level VARCHAR(50),
  current_career VARCHAR(150),
  interests TEXT[],
  technologies TEXT[]
);

CREATE TABLE careers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  match_score NUMERIC(5,2)
);

CREATE TABLE skills (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  current_score NUMERIC(5,2),
  required_score NUMERIC(5,2),
  default_weight NUMERIC(5,2)
);

CREATE TABLE career_skills (
  career_id BIGINT REFERENCES careers(id) ON DELETE CASCADE,
  skill_id BIGINT REFERENCES skills(id) ON DELETE CASCADE,
  required_score NUMERIC(5,2),
  PRIMARY KEY (career_id, skill_id)
);

CREATE TABLE electives (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  mapped_skills TEXT[],
  skill_boost TEXT
);

CREATE TABLE interview_questions (
  id BIGSERIAL PRIMARY KEY,
  career VARCHAR(150),
  question TEXT NOT NULL,
  sample_answer TEXT
);

CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  status VARCHAR(50) DEFAULT 'In Progress'
);

CREATE TABLE academic_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(150) NOT NULL,
  grade VARCHAR(50)
);

CREATE TABLE resume_analyses (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  overall_score NUMERIC(5,2),
  strengths TEXT[],
  missing_skills TEXT[],
  recommendations TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE specializations (
  id BIGSERIAL PRIMARY KEY,
  career_id BIGINT REFERENCES careers(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  required_skills TEXT[],
  recommended_electives TEXT[]
);