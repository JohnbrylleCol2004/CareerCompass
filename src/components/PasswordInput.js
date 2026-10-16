import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

export default function PasswordInput({ style, accessibilityLabel = 'Password', editable = true, ...props }) {
  const [visible, setVisible] = useState(false);
  const input = useRef(null);

  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        placeholderTextColor={props.placeholderTextColor || colors.gray}
        selectionColor={colors.primaryDark}
        cursorColor={colors.primaryDark}
        ref={input}
        style={[style, styles.input]}
        accessibilityLabel={accessibilityLabel}
        editable={editable}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={!visible}
      />
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`${visible ? 'Hide' : 'Show'} ${accessibilityLabel.toLowerCase()}`}
        accessibilityState={{ disabled: !editable }}
        disabled={!editable}
        style={styles.toggle}
        onPress={() => {
          setVisible(value => !value);
          input.current?.focus();
        }}
      >
        <Text style={styles.toggleText}>{visible ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, borderRadius: 9,
  },
  input: {
    flex: 1, minWidth: 0, minHeight: 50, borderWidth: 0,
    backgroundColor: 'transparent', color: colors.dark,
    textAlignVertical: 'center',
  },
  toggle: { minWidth: 64, minHeight: 48, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center' },
  toggleText: { color: colors.primaryDark, fontSize: 14, fontWeight: 'bold' },
});
