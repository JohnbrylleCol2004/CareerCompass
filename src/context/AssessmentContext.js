import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { normalizeAssessment } from '../data/careerAssessment.mjs';

const AssessmentContext = createContext(null);
const keyFor = id => `careercompass:assessment:v1:${id}`;

export function AssessmentProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const revision = useRef(0);
  const [state, setState] = useState({ userId: null, result: null, loading: false });

  useEffect(() => {
    const version = ++revision.current;
    let active = true;
    if (!userId) return () => { active = false; };
    AsyncStorage.getItem(keyFor(userId)).then(raw => {
      if (!active || version !== revision.current) return;
      let result = null;
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.version === 1) {
          const validated = normalizeAssessment(parsed);
          result = { ...validated, completedAt: parsed.completedAt };
        }
      } catch { /* Ignore corrupt or older device data. */ }
      setState({ userId, result, loading: false });
    }).catch(() => { if (active && version === revision.current) setState({ userId, result: null, loading: false }); });
    return () => { active = false; };
  }, [userId]);

  async function saveAssessment(value) {
    if (!userId) throw new Error('Please sign in again.');
    const result = normalizeAssessment(value);
    revision.current += 1;
    await AsyncStorage.setItem(keyFor(userId), JSON.stringify(result));
    setState({ userId, result, loading: false });
    return result;
  }

  return <AssessmentContext.Provider value={{
    result: state.userId === userId ? state.result : null,
    loading: !!userId && (state.userId !== userId || state.loading),
    saveAssessment,
  }}>{children}</AssessmentContext.Provider>;
}

export function useAssessment() { return useContext(AssessmentContext); }
