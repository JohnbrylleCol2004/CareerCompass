import React, { useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import PrimaryButton from './PrimaryButton';
import { validatePdfHeader, validatePdfMetadata } from '../utils/resumePdf';
import { colors } from '../theme/colors';

export default function ResumePdfInput({ onSelect, disabled = false }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const picking = useRef(false);

  async function pickFile() {
    if (picking.current || disabled) return;
    picking.current = true;
    setBusy(true);
    setError('');
    let copiedUri = null;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', multiple: false,
        // Android's picker can use Expo Go's shared cache instead of the project cache.
        copyToCacheDirectory: Platform.OS !== 'android',
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (typeof asset.size === 'number') validatePdfMetadata(asset.name, asset.size);
      let readableUri = asset.uri;
      if (Platform.OS === 'android') {
        if (!FileSystem.cacheDirectory) throw new Error('App storage is unavailable. Please restart the app.');
        copiedUri = `${FileSystem.cacheDirectory}resume-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
        // The system picker grants access to this content URI. Copy it into our own scope.
        await FileSystem.copyAsync({ from: asset.uri, to: copiedUri });
        readableUri = copiedUri;
      }
      const info = await FileSystem.getInfoAsync(readableUri);
      if (!info.exists || info.isDirectory) {
        throw new Error('This file is no longer available. Please select the PDF again.');
      }
      validatePdfMetadata(asset.name, info.size);
      const header = await FileSystem.readAsStringAsync(readableUri, {
        encoding: FileSystem.EncodingType.Base64,
        position: 0,
        length: 5,
      });
      validatePdfHeader(new Uint8Array(decode(header)));
      onSelect({ name: asset.name, size: info.size, uri: readableUri, mimeType: 'application/pdf' });
    } catch (err) {
      if (copiedUri) await FileSystem.deleteAsync(copiedUri, { idempotent: true }).catch(() => {});
      setError(err?.message || 'Unable to read this file. Please try another PDF.');
    } finally {
      picking.current = false;
      setBusy(false);
    }
  }

  return (
    <View>
      <Text style={{ color: colors.gray }}>Choose a PDF resume from your device. Maximum 10 MB.</Text>
      <PrimaryButton title="Add PDF" onPress={pickFile} loading={busy} disabled={busy || disabled} />
      {!!error && <Text accessibilityRole="alert" style={{ color: colors.danger }}>{error}</Text>}
    </View>
  );
}
