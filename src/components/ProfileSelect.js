import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../theme/colors';

export default function ProfileSelect({ label, value, options, placeholder, disabled, onValueChange }) {
  const legacy = !!value && !options.includes(value);
  return <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.border} pointerEvents={disabled ? 'none' : 'auto'}>
      <Picker accessibilityLabel={label} selectedValue={value} enabled={!disabled}
        accessibilityState={{ disabled: !!disabled }}
        onValueChange={next => { if (!disabled) onValueChange(next); }} style={styles.picker} dropdownIconColor={colors.dark}>
        <Picker.Item label={placeholder} value="" />
        {legacy && <Picker.Item label={`${value} (previous selection)`} value={value} />}
        {options.map(option => <Picker.Item key={option} label={option} value={option} />)}
      </Picker>
    </View>
    {legacy && !disabled && <Text style={styles.warning}>Choose an available option or clear the previous selection.</Text>}
  </View>;
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  label: { fontWeight: 'bold', color: colors.dark, marginBottom: 6 },
  border: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, overflow: 'hidden', backgroundColor: colors.white },
  picker: { color: colors.dark, width: '100%' },
  warning: { color: colors.danger, marginTop: 6 },
});
