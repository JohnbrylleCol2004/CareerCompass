import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoCircle}>
          <Text style={styles.logo}>✦</Text>
        </View>

        <Text style={styles.title}>Career Compass</Text>

        <Text style={styles.subtitle}>
          Your decision-support tool for discovering the right career path.
        </Text>

        <Text style={styles.description}>
          Identify your skills, explore careers, receive elective
          recommendations, and prepare for future job opportunities.
        </Text>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Login"
            onPress={() => navigation.navigate('Login')}
          />

          <PrimaryButton
            title="Create Account"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  logoCircle: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  logo: {
    fontSize: 45,
    color: colors.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.dark,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    color: colors.dark,
    marginBottom: 35,
  },
  buttonContainer: {
    width: '100%',
  },
});