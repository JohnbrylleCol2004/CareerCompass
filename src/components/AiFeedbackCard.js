import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function AiFeedbackCard({ title, items }) {
  if (!items?.length) return null;
  return <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    {items.map((item, index) => <Text key={index} style={styles.item}>• {item}</Text>)}
  </View>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 16, marginVertical: 8 },
  title: { color: colors.dark, fontSize: 17, fontWeight: 'bold', marginBottom: 8 },
  item: { color: colors.dark, fontSize: 15, lineHeight: 23, marginBottom: 8 },
});
