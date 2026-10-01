import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@career_compass_users';
const SESSION_KEY = '@career_compass_session';

const defaultUsers = [
  {
    id: 'student-demo',
    name: 'Juan Dela Cruz',
    username: 'juan123',
    email: 'juan@example.com',
    password: '123456',
    role: 'student',
    academicYear: '1st Year',
    experienceLevel: 'Entry Level',
    currentCareer: 'Web Developer',
    interests: ['Web Development', 'Networking'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 'admin-demo',
    name: 'Career Compass Admin',
    username: 'admin',
    email: 'admin@careercompass.com',
    password: 'admin123',
    role: 'admin',
  },
];

async function getUsers() {
  const savedUsers = await AsyncStorage.getItem(USERS_KEY);

  if (!savedUsers) {
    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify(defaultUsers)
    );

    return defaultUsers;
  }

  return JSON.parse(savedUsers);
}

function removePassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function login(identifier, password) {
  const users = await getUsers();

  const user = users.find(
    (item) =>
      item.username.toLowerCase() === identifier.toLowerCase() ||
      item.email.toLowerCase() === identifier.toLowerCase()
  );

  if (!user || user.password !== password) {
    throw new Error('Invalid username/email or password.');
  }

  const safeUser = removePassword(user);

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(safeUser)
  );

  return safeUser;
}

export async function register(userData) {
  const users = await getUsers();

  const existingUser = users.find(
    (item) =>
      item.username.toLowerCase() === userData.username.toLowerCase() ||
      item.email.toLowerCase() === userData.email.toLowerCase()
  );

  if (existingUser) {
    throw new Error('Username or email already exists.');
  }

  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'student',
    academicYear: userData.academicYear || '1st Year',
    experienceLevel: userData.experienceLevel || 'Entry Level',
    currentCareer: 'Web Developer',
    interests: [],
    technologies: [],
  };

  const updatedUsers = [...users, newUser];

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify(updatedUsers)
  );

  const safeUser = removePassword(newUser);

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(safeUser)
  );

  return safeUser;
}

export async function getCurrentUser() {
  const session = await AsyncStorage.getItem(SESSION_KEY);

  if (!session) {
    return null;
  }

  return JSON.parse(session);
}

export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function clearAllUsers() {
  await AsyncStorage.removeItem(USERS_KEY);
  await AsyncStorage.removeItem(SESSION_KEY);
}