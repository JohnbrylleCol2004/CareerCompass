import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function AppHeader({
  title = 'CareerCompass',
  onProfilePress,
  onMenuPress,
  onBackPress,
  showBack = false,
}) {
  return (
    <View style={styles.header}>
      {onMenuPress ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Open navigation menu" style={styles.backButton} onPress={onMenuPress}>
          <Ionicons name="menu-outline" size={26} color={colors.dark} />
        </Pressable>
      ) : showBack && onBackPress ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={22} color={colors.dark} />
        </Pressable>
      ) : (
        <Image source={require('../../assets/careercompass_logo.png')} style={styles.logo} accessibilityLabel="CareerCompass logo" />
      )}

      <Text style={styles.title}>{title}</Text>

      {onProfilePress && (
        <Pressable accessibilityRole="button" accessibilityLabel="Open profile" style={styles.profileButton} onPress={onProfilePress}>
          <Text style={styles.profileText}>Profile</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 64,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  logo: { width: 38, height: 38, borderRadius: 9 },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginLeft: 12,
    marginRight: 8,
  },
  profileButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
  },
  profileText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
