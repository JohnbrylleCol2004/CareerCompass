import { mockUser, mockAdmin } from '../data/mockData';

let currentUser = null;

export async function login(username, password) {
  await delay(500);

  if (!username || !password) {
    throw new Error('Username and password are required.');
  }

  if (username === 'admin') {
    currentUser = mockAdmin;
    return currentUser;
  }

  currentUser = mockUser;
  return currentUser;
}

export async function register(userData) {
  await delay(500);

  if (
    !userData.name ||
    !userData.username ||
    !userData.email ||
    !userData.password
  ) {
    throw new Error('Please complete all required fields.');
  }

  const newUser = {
    id: Date.now(),
    name: userData.name,
    username: userData.username,
    email: userData.email,
    role: 'student',
  };

  currentUser = newUser;

  return newUser;
}

export async function logout() {
  await delay(300);
  currentUser = null;
  return true;
}

export async function getCurrentUser() {
  await delay(200);
  return currentUser;
}

export function isAuthenticated() {
  return currentUser !== null;
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}