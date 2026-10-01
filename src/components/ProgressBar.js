import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function ProgressBar({
  label,
  current = 0,
  required = 100,
}) {
  const percentage = Math.min(
    Math.max((current / required) * 100, 0),
    100
  );

  const meetsRequirement = current >= required;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.score}>
          {current}% / {required}%
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            {
              width: `${percentage}%`,
              backgroundColor: meetsRequirement
                ? colors.primary
                : colors.danger,
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.status,
          {
            color: meetsRequirement
              ? colors.primary
              : colors.danger,
          },
        ]}
      >
        {meetsRequirement
          ? 'Requirement met'
          : 'Needs improvement'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: colors.dark,
    fontSize: 14,
    fontWeight: 'bold',
  },
  score: {
    color: colors.gray,
    fontSize: 13,
  },
  track: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 5,
  },
  status: {
    fontSize: 12,
    marginTop: 4,
  },
});