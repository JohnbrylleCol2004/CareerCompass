import React, { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import useReducedMotion from '../hooks/useReducedMotion';

export default function ResultReveal({ children }) {
  const reducedMotion = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration: reducedMotion ? 0 : 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [opacity, reducedMotion]);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}
