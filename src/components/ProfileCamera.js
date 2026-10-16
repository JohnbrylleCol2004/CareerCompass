import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function ProfileCamera({ initialFacing, onCancel, onUsePhoto }) {
  const camera = useRef(null);
  const captureInProgress = useRef(false);
  const [facing, setFacing] = useState(initialFacing);
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      setAppActive(state === 'active');
      setReady(false);
    });
    return () => subscription.remove();
  }, []);

  async function takePhoto() {
    if (!ready || !camera.current || captureInProgress.current) return;
    captureInProgress.current = true;
    setCapturing(true);
    setError('');
    try {
      const picture = await camera.current.takePictureAsync({ quality: 0.8 });
      if (!picture?.uri) throw new Error('No photo was captured. Please try again.');
      setPhoto(picture);
      setReady(false);
    } catch (err) {
      setError(err?.message || 'Unable to take photo. Please try again.');
    } finally {
      captureInProgress.current = false;
      setCapturing(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>{photo ? 'Preview photo' : `${facing === 'front' ? 'Front' : 'Back'} camera`}</Text>
      <View style={styles.preview}>
        {photo ? <Image source={{ uri: photo.uri }} style={styles.fill} resizeMode="contain" /> : appActive && (
          <CameraView key={facing} ref={camera} style={styles.fill} facing={facing} mode="picture"
            onCameraReady={() => setReady(true)}
            onMountError={() => { setReady(false); setError('This camera could not open. Try switching to the other camera.'); }} />
        )}
      </View>
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <View style={styles.controls}>
        <TouchableOpacity accessibilityRole="button" style={styles.button} disabled={capturing} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        {photo ? (
          <>
            <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => { setPhoto(null); setError(''); setReady(false); }}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => onUsePhoto(photo)}>
              <Text style={styles.buttonText}>Use Photo</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity accessibilityRole="button" style={styles.button} disabled={capturing} onPress={() => {
              setReady(false); setError(''); setFacing(value => value === 'front' ? 'back' : 'front');
            }}>
              <Text style={styles.buttonText}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" style={[styles.button, (!ready || capturing) && styles.disabled]}
              disabled={!ready || capturing} onPress={takePhoto}>
              {capturing ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Take Photo</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  title: { color: colors.white, fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 16 },
  preview: { flex: 1, overflow: 'hidden' },
  fill: { width: '100%', height: '100%' },
  controls: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, padding: 16 },
  button: { backgroundColor: colors.primaryDark, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, minHeight: 48, justifyContent: 'center' },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  disabled: { opacity: 0.5 },
  error: { color: colors.white, fontSize: 15, textAlign: 'center', padding: 12 },
});
