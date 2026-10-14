import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { getProfilePhotoUrl, uploadProfilePhoto } from '../services/profilePhotoService';
import { colors } from '../theme/colors';

export default function ProfilePhoto() {
  const { user, updateProfile } = useAuth();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState(false);
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

  async function choosePhoto() {
    if (busy.current) return;
    busy.current = true;
    setUploading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const uploadedPath = await uploadProfilePhoto(result.assets[0]);
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
      {photoUrl && !photoError ? (
        <Image source={{ uri: photoUrl }} style={styles.photo} accessibilityLabel="Your profile photo"
          onError={() => setPhotoError(true)} />
      ) : (
        <View style={[styles.photo, styles.placeholder]}>
          <Ionicons name="person-outline" size={54} color={colors.primaryDark} />
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={choosePhoto} disabled={uploading}
        accessibilityRole="button" accessibilityState={{ disabled: uploading, busy: uploading }}>
        {uploading ? <ActivityIndicator color={colors.white} /> : (
          <Ionicons name="camera-outline" size={20} color={colors.white} />
        )}
        <Text style={styles.buttonText}>{uploading ? 'Saving photo...' : path ? 'Change photo' : 'Add photo'}</Text>
      </TouchableOpacity>
      {photoError && <Text style={styles.error}>Photo could not load. Check your connection and reopen Profile.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  photo: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.secondary },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  button: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primaryDark,
    borderRadius: 10, paddingHorizontal: 18, paddingVertical: 12, minHeight: 44 },
  buttonText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  error: { color: colors.danger, textAlign: 'center', fontSize: 13 },
});
