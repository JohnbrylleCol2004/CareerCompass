import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function SummaryCard({
  title,
  value,
  description,
  onPress,
  variant = 'card',
}) {
  const isList = variant === 'list';
  const content = (
    <>
      <View style={styles.titleRow}>
        <Text style={[styles.title, isList && value && styles.listLabel]}>{title}</Text>
        {onPress && <Ionicons name="chevron-forward" size={18} color={colors.primaryDark} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />}
      </View>

      {value && <Text style={[styles.value, isList && styles.listValue]}>{value}</Text>}

      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </>
  );

  if (!onPress) return <View style={[styles.card, isList && styles.listRow]}>{content}</View>;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, isList && styles.listRow, styles.actionCard, pressed && styles.pressedCard]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[title, value, description].filter(Boolean).join('. ')}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionCard: { minHeight: 72, justifyContent: 'center' },
  pressedCard: { backgroundColor: colors.secondary },
  listRow: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    marginVertical: 0,
    paddingHorizontal: 2,
    paddingVertical: 14,
  },
  listLabel: { color: colors.gray, fontSize: 14, fontWeight: '500' },
  listValue: { color: colors.dark, fontSize: 16, fontWeight: '600' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: {
    flexShrink: 1,
    color: colors.dark,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    color: colors.primaryDark,
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: colors.dark,
    fontSize: 14,
    lineHeight: 20,
  },
});
