import {
  mockUser,
  careers,
  skills,
  electives,
  interviewQuestions,
  resumeAnalysis,
  academicRecords,
  projects,
  specializations,
  adminSummary,
} from '../data/mockData';

// Student API functions

export async function getStudentProfile() {
  await delay(300);
  return mockUser;
}

export async function updateStudentProfile(updatedData) {
  await delay(400);

  return {
    ...mockUser,
    ...updatedData,
  };
}

export async function getStudentDashboard() {
  await delay(300);

  return {
    user: mockUser,
    topCareer: careers[0],
    skills,
    careerCount: careers.length,
    electiveCount: electives.length,
  };
}

export async function getSkillGap() {
  await delay(300);
  return skills;
}

export async function getCareerRecommendations() {
  await delay(300);
  return careers;
}

export async function getElectiveRecommendations() {
  await delay(300);
  return electives;
}

export async function getInterviewQuestions(career = 'Web Developer') {
  await delay(300);

  return interviewQuestions.filter(
    (item) => item.career === career
  );
}

export async function analyzeResume(resumeText) {
  await delay(700);

  if (!resumeText || resumeText.trim() === '') {
    throw new Error('Resume text is required.');
  }

  return resumeAnalysis;
}

export async function getAcademicRecords() {
  await delay(300);
  return academicRecords;
}

export async function getProjects() {
  await delay(300);
  return projects;
}

// Admin API functions

export async function getAdminSummary() {
  await delay(300);
  return adminSummary;
}

export async function getCareerProfiles() {
  await delay(300);
  return careers;
}

export async function getSkillRequirements() {
  await delay(300);
  return skills;
}

export async function getSpecializations() {
  await delay(300);
  return specializations;
}

export async function getElectiveMappings() {
  await delay(300);
  return electives;
}

// Future CRUD functions

export async function createCareer(careerData) {
  await delay(400);

  return {
    id: Date.now(),
    ...careerData,
  };
}

export async function updateCareer(careerId, careerData) {
  await delay(400);

  return {
    id: careerId,
    ...careerData,
  };
}

export async function createSkill(skillData) {
  await delay(400);

  return {
    id: Date.now(),
    ...skillData,
  };
}

export async function createElective(electiveData) {
  await delay(400);

  return {
    id: Date.now(),
    ...electiveData,
  };
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}