import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import SummaryCard from '../../components/SummaryCard';
import LogoutButton from '../../components/LogoutButton';
import { colors } from '../../theme/colors';

export default function AdminDashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Admin Dashboard</Text>

        <SummaryCard
          title="Total Students"
          value="128"
        />

        <SummaryCard
          title="Active Career Profiles"
          value="12"
        />

        <SummaryCard
          title="Available Skills"
          value="18"
        />

        <SummaryCard
          title="Available Electives"
          value="9"
        />

        <SummaryCard
          title="Recent System Update"
          description="Web Developer career profile was updated."
        />

        <LogoutButton />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },

  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
});