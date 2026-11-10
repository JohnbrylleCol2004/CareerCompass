import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';

let reduced = false;
let subscription = null;
const listeners = new Set();

function updateReducedMotion(value) {
  if (reduced === value) return;
  reduced = value;
  listeners.forEach(listener => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  if (!subscription) {
    subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', updateReducedMotion);
    AccessibilityInfo.isReduceMotionEnabled().then(updateReducedMotion).catch(() => {});
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      subscription?.remove();
      subscription = null;
    }
  };
}

export default function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => reduced, () => false);
}
