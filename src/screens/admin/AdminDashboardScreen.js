import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import SummaryCard from '../../components/SummaryCard';
import { colors } from '../../theme/colors';
import LogoutButton from '../../components/LogoutButton';

export default function AdminDashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <SummaryCard title="Total Students" value="128" />
      <SummaryCard title="Active Career Profiles" value="12" />
      <SummaryCard title="Available Skills" value="18" />
      <SummaryCard title="Available Electives" value="9" />
      <SummaryCard
        title="Recent System Update"
        description="Web Developer career profile was updated."
      />
      
      <LogoutButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
});