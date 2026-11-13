import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { checkProfilePhoto, getProfilePhotoUrl, uploadProfilePhoto } from '../services/profilePhotoService';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme/colors';
import ProfileCamera from './ProfileCamera';
import { useNetwork } from '../context/NetworkContext';

export default function ProfilePhoto({ explicitUpload = false, disabled = false, onBusyChange }) {
  const { user, updateProfile } = useAuth();
  const { offline, requireConnection } = useNetwork();
  const [iconsLoaded] = useFonts(Ionicons.font);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [cameraFacing, setCameraFacing] = useState(null);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [, requestCameraPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const busy = useRef(false);
  const path = user?.profile_image_path;
  useEffect(() => {
    onBusyChange?.(uploading || !!cameraFacing);
    return () => onBusyChange?.(false);
  }, [uploading, cameraFacing, onBusyChange]);
  useFocusEffect(useCallback(() => () => setCameraFacing(null), []));

  useFocusEffect(useCallback(() => {
    let active = true;
    async function loadPhoto() {
      if (offline) return;
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
  }, [path, offline]));

  function choosePhoto() {
    if (!requireConnection()) return;
    if (busy.current || disabled) return;
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
    if (busy.current || disabled) return;
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

  async function savePhoto(capturedPhoto, commit = false) {
    setCameraFacing(null);
    if (!requireConnection()) return;
    if (busy.current || disabled) return;
    busy.current = true;
    setUploading(true);
    try {
      const options = {
        mediaTypes: ['images'],
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
      };
      let asset = capturedPhoto;
      if (!asset) {
        const result = await ImagePicker.launchImageLibraryAsync(options);
        if (result.canceled || !result.assets?.[0]) return;
        asset = result.assets[0];
      }
      await checkProfilePhoto(asset);
      if (explicitUpload && !commit) {
        setPendingPhoto(asset);
        setPhotoError(false);
        return;
      }
      const uploadedPath = await uploadProfilePhoto(asset);
      await updateProfile({ profile_image_path: uploadedPath });
      setPendingPhoto(null);
      try {
        setPhotoUrl(await getProfilePhotoUrl(uploadedPath));
        setPhotoError(false);
      } catch {
        setPhotoError(true);
      }
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
          onCancel={() => setCameraFacing(null)} onUsePhoto={photo => savePhoto({ ...photo, mimeType: 'image/jpeg' })} />}
      </Modal>
      <TouchableOpacity onPress={choosePhoto} disabled={uploading || disabled}
        style={styles.photoButton} accessibilityRole="button"
        accessibilityLabel={path ? 'Change profile photo' : 'Add profile photo'}
        accessibilityState={{ disabled: uploading || disabled, busy: uploading }}>
      {(pendingPhoto?.uri || photoUrl) && !photoError ? (
        <Image source={{ uri: pendingPhoto?.uri || photoUrl }} style={styles.photo} accessibilityLabel={pendingPhoto ? 'Selected photo preview' : 'Your profile photo'}
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
      {explicitUpload && <View style={{ alignSelf: 'stretch' }}>
        <PrimaryButton title="Choose Profile Picture" variant="secondary" onPress={choosePhoto} disabled={disabled || uploading} />
        <PrimaryButton title="Upload Picture" onPress={() => savePhoto(pendingPhoto, true)} loading={uploading} disabled={disabled || !pendingPhoto} />
        {pendingPhoto && <PrimaryButton title="Cancel Selection" variant="secondary" onPress={() => { setPendingPhoto(null); setPhotoError(false); }} disabled={disabled || uploading} />}
        <Text style={styles.hint}>PNG or JPG/JPEG only · Maximum 2 MB · Square image recommended</Text>
        {pendingPhoto && <Text style={styles.hint}>Preview only. Tap Upload Picture to save this photo.</Text>}
      </View>}
      {photoError && <Text style={styles.error}>Photo could not load. Check your connection and reopen Profile.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { color: colors.gray, textAlign: 'center', fontSize: 13, marginTop: 8 },
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
