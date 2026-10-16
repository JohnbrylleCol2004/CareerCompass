import React from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNetwork } from '../context/NetworkContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function OfflineNotice() {
  const { offline, noticeVisible, checking, retry, dismissNotice } = useNetwork();
  const { user } = useAuth();
  const check = () => retry().catch(() => {});
  return <>
    {offline && <SafeAreaView edges={['top', 'left', 'right']} style={styles.bannerArea}>
      <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.banner}>
        <View style={styles.badge}><Text style={styles.exclamation}>!</Text></View>
        <View style={styles.copy}>
          <Text style={styles.bannerTitle}>You’re offline</Text>
          <Text style={styles.bannerText}>{user
            ? 'Showing saved details. Connect to Wi-Fi or mobile data to save changes.'
            : 'Connect to Wi-Fi or mobile data to sign in or register.'}</Text>
        </View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Check internet connection" style={styles.retrySmall} onPress={check} disabled={checking}>
          {checking ? <ActivityIndicator color="#805215" /> : <Text style={styles.retryText}>Retry</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>}
    <Modal transparent visible={noticeVisible} animationType="fade" onRequestClose={dismissNotice}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.cardContent}>
            <View style={styles.largeBadge}><Text style={styles.largeExclamation}>!</Text></View>
            <Text style={styles.eyebrow}>CONNECTION NEEDED</Text>
            <Text style={styles.title}>Let’s get you back online</Text>
            <Text style={styles.description}>Connect to Wi-Fi or turn on mobile data, then try again.</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>{user ? 'You can still browse' : 'Sign in when you’re connected'}</Text>
              <Text style={styles.infoText}>{user
                ? 'Your last saved profile and built-in practice content are available. Saving edits and uploading photos need internet.'
                : 'Signing in and registering need internet. After signing in online, your saved profile will be available offline on this device.'}</Text>
              <Text style={styles.infoText}>Changes are not queued or saved offline.</Text>
            </View>
            <TouchableOpacity accessibilityRole="button" style={styles.primary} onPress={check} disabled={checking}>
              {checking ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryText}>Check connection</Text>}
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" style={styles.secondary} onPress={dismissNotice}>
              <Text style={styles.secondaryText}>Continue offline</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  </>;
}
const styles = StyleSheet.create({
  bannerArea: { backgroundColor: '#FFF5DF' },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderColor: '#EBCB8C' },
  badge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F6D58D', alignItems: 'center', justifyContent: 'center' },
  exclamation: { fontSize: 22, fontWeight: 'bold', color: '#805215' },
  copy: { flex: 1 }, bannerTitle: { color: '#65400E', fontWeight: 'bold', fontSize: 15 },
  bannerText: { color: '#805215', fontSize: 12, lineHeight: 17, marginTop: 2 },
  retrySmall: { minHeight: 44, minWidth: 48, justifyContent: 'center', alignItems: 'center' },
  retryText: { fontWeight: 'bold', color: '#805215' },
  backdrop: { flex: 1, backgroundColor: 'rgba(12, 37, 32, 0.6)', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: colors.white, borderRadius: 24, maxHeight: '90%', width: '100%', maxWidth: 440, alignSelf: 'center', overflow: 'hidden' },
  cardContent: { padding: 24, alignItems: 'center' },
  largeBadge: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFF0CF', justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  largeExclamation: { fontSize: 44, fontWeight: 'bold', color: '#A36D19' },
  eyebrow: { color: '#A36D19', fontWeight: 'bold', fontSize: 11, letterSpacing: 1.5, marginBottom: 10 },
  title: { color: colors.dark, fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  description: { color: colors.gray, fontSize: 15, lineHeight: 23, textAlign: 'center', marginVertical: 14 },
  infoBox: { width: '100%', backgroundColor: colors.background, borderRadius: 14, padding: 16, marginBottom: 20 },
  infoTitle: { color: colors.dark, fontWeight: 'bold', fontSize: 15, marginBottom: 6 },
  infoText: { color: colors.text, fontSize: 13, lineHeight: 20, marginBottom: 4 },
  primary: { width: '100%', backgroundColor: colors.primaryDark, padding: 15, borderRadius: 12, alignItems: 'center', minHeight: 50 },
  primaryText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
  secondary: { padding: 15, minHeight: 48 },
  secondaryText: { color: colors.primaryDark, fontWeight: 'bold', fontSize: 15 },
});
