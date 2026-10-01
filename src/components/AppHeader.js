import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';

export default function AppHeader({
  title = 'Career Compass',
  onProfilePress,
  onBackPress,
  showBack = false,
}) {
  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={onBackPress}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>✦</Text>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={onProfilePress}
      >
        <Text style={styles.profileText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 65,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  logoCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.white,
    fontSize: 20,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginLeft: 12,
  },
  profileButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 15,
  },
  profileText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  back: {
    fontSize: 38,
    color: colors.dark,
  },
});