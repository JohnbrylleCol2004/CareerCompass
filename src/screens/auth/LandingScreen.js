import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={require('../../../assets/careercompass_logo.png')} style={styles.logo} accessibilityLabel="CareerCompass logo" />

        <Text style={styles.title}>CareerCompass</Text>

        <Text style={styles.subtitle}>
          Explore where your BSIT degree can take you.
        </Text>

        <Text style={styles.description}>
          Compare career paths and electives, review example skill gaps, and prepare for interviews and resumes.
        </Text>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Login"
            onPress={() => navigation.navigate('Login')}
          />

          <PrimaryButton
            title="Create Account"
            variant="secondary"
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
  logo: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 22,
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
