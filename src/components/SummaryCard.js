import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';

export default function SummaryCard({
  title,
  value,
  description,
  onPress,
}) {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.title}>{title}</Text>

      {value && <Text style={styles.value}>{value}</Text>}

      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.dark,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  value: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    color: colors.dark,
    fontSize: 14,
    lineHeight: 20,
  },
});