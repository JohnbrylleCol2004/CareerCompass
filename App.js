import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './src/navigation/AuthNavigator';
import StudentNavigator from './src/navigation/StudentNavigator';
import AdminNavigator from './src/navigation/AdminNavigator';

export default function App() {
  // Change this value while testing:
  // 'auth', 'student', or 'admin'
  const [userType] = useState('student');

  return (
    <NavigationContainer>
      {userType === 'student' && <StudentNavigator />}

      {userType === 'admin' && <AdminNavigator />}

      {userType === 'auth' && <AuthNavigator />}
    </NavigationContainer>
  );
}