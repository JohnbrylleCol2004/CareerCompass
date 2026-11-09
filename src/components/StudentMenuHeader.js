import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from './AppHeader';
import { colors } from '../theme/colors';

const destinations = [
  { name: 'Dashboard', label: 'Dashboard', icon: 'home-outline' },
  { name: 'Skill Gap', label: 'Skill Gap', icon: 'analytics-outline' },
  { name: 'Careers', label: 'Careers', icon: 'briefcase-outline' },
  { name: 'Profile', label: 'Profile', icon: 'person-outline' },
];

export default function StudentMenuHeader({ title, current, navigation }) {
  const [open, setOpen] = useState(false);
  const { width } = useWindowDimensions();

  function goTo(name) {
    setOpen(false);
    if (name !== current) navigation.navigate(name);
  }

  return (
    <>
      <AppHeader title={title} onMenuPress={() => setOpen(true)} />
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.scrim}
            accessibilityRole="button"
            accessibilityLabel="Close navigation menu"
            onPress={() => setOpen(false)}
          />
          <SafeAreaView style={[styles.sheet, { width: Math.min(width - 56, 320) }]} edges={['top', 'bottom']} accessibilityViewIsModal>
            <View style={styles.sheetHeader}>
              <Text accessibilityRole="header" style={styles.sheetTitle}>Menu</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close menu" style={styles.closeButton} onPress={() => setOpen(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.destinations}>
              {destinations.map(({ name, label, icon }) => {
                const selected = current === name;
                return (
                  <Pressable
                    key={name}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityState={{ selected }}
                    onPress={() => goTo(name)}
                    style={({ pressed }) => [styles.destination, selected && styles.selectedDestination, pressed && styles.pressedDestination]}
                  >
                    <Ionicons name={icon} size={22} color={selected ? colors.primaryDark : colors.text} />
                    <Text style={[styles.destinationText, selected && styles.selectedText]}>{label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, flexDirection: 'row' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(12, 37, 32, 0.42)' },
  sheet: { height: '100%', backgroundColor: colors.white },
  sheetHeader: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  sheetTitle: { color: colors.dark, fontSize: 20, fontWeight: 'bold' },
  closeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  destinations: { paddingHorizontal: 12, paddingVertical: 12 },
  destination: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, borderRadius: 10, marginVertical: 2 },
  selectedDestination: { backgroundColor: colors.secondary },
  pressedDestination: { backgroundColor: colors.secondary },
  destinationText: { color: colors.text, fontSize: 16, fontWeight: '500' },
  selectedText: { color: colors.primaryDark, fontWeight: 'bold' },
});
