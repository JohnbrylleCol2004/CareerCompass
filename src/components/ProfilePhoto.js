import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { getProfilePhotoUrl, uploadProfilePhoto } from '../services/profilePhotoService';
import { colors } from '../theme/colors';
import ProfileCamera from './ProfileCamera';

export default function ProfilePhoto() {
  const { user, updateProfile } = useAuth();
  const [iconsLoaded] = useFonts(Ionicons.font);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [cameraFacing, setCameraFacing] = useState(null);
  const [, requestCameraPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const busy = useRef(false);
  const path = user?.profile_image_path;

  useFocusEffect(useCallback(() => {
    let active = true;
    async function loadPhoto() {
      try {
        const url = await getProfilePhotoUrl(path);
        if (active) {
          setPhotoUrl(url);
          setPhotoError(false);
        }
      } catch {
        if (active) {
          setPhotoUrl(null);
          setPhotoError(true);
        }
      }
    }
    loadPhoto();
    const timer = setInterval(loadPhoto, 50 * 60 * 1000);
    return () => { active = false; clearInterval(timer); };
  }, [path]));

  function choosePhoto() {
    if (busy.current) return;
    Alert.alert('Profile photo', 'Choose how to add your photo.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Choose from Gallery', onPress: () => savePhoto() },
      { text: 'Take Photo', onPress: chooseCamera },
    ]);
  }

  function chooseCamera() {
    Alert.alert('Take photo', 'Which camera would you like to use?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Front Camera', onPress: () => openCamera('front') },
      { text: 'Back Camera', onPress: () => openCamera('back') },
    ]);
  }

  async function openCamera(facing) {
    if (busy.current) return;
    busy.current = true;
    try {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Camera permission needed',
          permission.canAskAgain
            ? 'Allow camera access to take a profile photo. You can also choose a photo from your gallery.'
            : 'Enable camera access in your device settings to take a profile photo.',
          permission.canAskAgain ? [{ text: 'OK' }] : [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings().catch(() => {
              Alert.alert('Unable to open settings', 'Open your device settings and enable camera access for CareerCompass.');
            }) },
          ]);
        return;
      }
      setCameraFacing(facing);
    } catch (error) {
      Alert.alert('Unable to open camera', error?.message || 'Please try again.');
    } finally {
      busy.current = false;
    }
  }

  async function savePhoto(capturedPhoto) {
    if (busy.current) return;
    busy.current = true;
    setCameraFacing(null);
    setUploading(true);
    try {
      const options = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };
      let asset = capturedPhoto;
      if (!asset) {
        const result = await ImagePicker.launchImageLibraryAsync(options);
        if (result.canceled || !result.assets?.[0]) return;
        asset = result.assets[0];
      }
      const uploadedPath = await uploadProfilePhoto(asset);
      await updateProfile({ profile_image_path: uploadedPath });
    } catch (error) {
      Alert.alert('Unable to save photo', error?.message || 'Please try again.');
    } finally {
      busy.current = false;
      setUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Modal visible={!!cameraFacing && isFocused} animationType="slide" onRequestClose={() => setCameraFacing(null)}>
        {!!cameraFacing && isFocused && <ProfileCamera initialFacing={cameraFacing}
          onCancel={() => setCameraFacing(null)} onUsePhoto={savePhoto} />}
      </Modal>
      <TouchableOpacity onPress={choosePhoto} disabled={uploading}
        style={styles.photoButton} accessibilityRole="button"
        accessibilityLabel={path ? 'Change profile photo' : 'Add profile photo'}
        accessibilityState={{ disabled: uploading, busy: uploading }}>
      {photoUrl && !photoError ? (
        <Image source={{ uri: photoUrl }} style={styles.photo} accessibilityLabel="Your profile photo"
          onError={() => setPhotoError(true)} />
      ) : (
        <View style={[styles.photo, styles.placeholder]}>
          {iconsLoaded ? <Ionicons name="person-outline" size={54} color={colors.dark} /> : (
            <Text style={styles.initial}>{(user?.first_name || user?.username || '?').charAt(0).toUpperCase()}</Text>
          )}
        </View>
      )}
        <View style={styles.addBadge}>
          {uploading ? <ActivityIndicator color={colors.white} /> : (
            <Text style={styles.plus} allowFontScaling={false}>+</Text>
          )}
        </View>
      </TouchableOpacity>
      {photoError && <Text style={styles.error}>Photo could not load. Check your connection and reopen Profile.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  photoButton: { padding: 6, position: 'relative' },
  addBadge: { position: 'absolute', bottom: 2, right: 2, width: 36, height: 36,
    borderRadius: 18, borderWidth: 2, borderColor: colors.white, backgroundColor: colors.dark,
    alignItems: 'center', justifyContent: 'center' },
  plus: { color: colors.white, fontSize: 28, lineHeight: 30, textAlign: 'center' },
  initial: { color: colors.dark, fontSize: 40, fontWeight: 'bold' },
  photo: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.secondary },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.danger, textAlign: 'center', fontSize: 13 },
});
