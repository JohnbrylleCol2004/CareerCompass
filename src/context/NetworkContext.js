import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkContext = createContext(null);
export function NetworkProvider({ children }) {
  const [status, setStatus] = useState({ ready: false, offline: false });
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [checking, setChecking] = useState(false);
  const checkingRef = useRef(false);
  const applyStatus = useCallback(state => {
    const offline = state.isConnected === false || state.isInternetReachable === false;
    setStatus({ ready: true, offline });
    if (!offline) setNoticeVisible(false);
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(applyStatus);
    const appState = AppState.addEventListener('change', state => {
      if (state === 'active') NetInfo.refresh().then(applyStatus).catch(() => {});
    });
    return () => { unsubscribe(); appState.remove(); };
  }, [applyStatus]);
  async function retry() {
    if (checkingRef.current) return;
    checkingRef.current = true;
    setChecking(true);
    try { applyStatus(await NetInfo.refresh()); } finally {
      checkingRef.current = false;
      setChecking(false);
    }
  }
  function requireConnection() {
    if (!status.offline && status.ready) return true;
    setNoticeVisible(true);
    return false;
  }
  return <NetworkContext.Provider value={{ ...status, checking, retry, requireConnection,
    noticeVisible, dismissNotice: () => setNoticeVisible(false) }}>{children}</NetworkContext.Provider>;
}
export const useNetwork = () => useContext(NetworkContext);
