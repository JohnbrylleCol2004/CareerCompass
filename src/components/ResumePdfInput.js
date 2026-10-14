import React, { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { File, FileMode } from 'expo-file-system';
import PrimaryButton from './PrimaryButton';
import { validatePdfHeader, validatePdfMetadata } from '../utils/resumePdf';
import { colors } from '../theme/colors';

export default function ResumePdfInput({ onSelect }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const picking = useRef(false);

  async function pickFile() {
    if (picking.current) return;
    picking.current = true;
    setBusy(true);
    setError('');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', multiple: false, copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      const file = new File(asset.uri);
      validatePdfMetadata(asset.name, file.size);
      const handle = file.open(FileMode.ReadOnly);
      try { validatePdfHeader(handle.readBytes(5)); } finally { handle.close(); }
      onSelect({ name: asset.name, size: file.size, uri: asset.uri, mimeType: 'application/pdf' });
    } catch (err) {
      setError(err?.message || 'Unable to read this file. Please try another PDF.');
    } finally {
      picking.current = false;
      setBusy(false);
    }
  }

  return (
    <View>
      <Text style={{ color: colors.gray }}>Choose a PDF resume from your device. Maximum 10 MB.</Text>
      <PrimaryButton title="Add PDF" onPress={pickFile} loading={busy} disabled={busy} />
      {!!error && <Text accessibilityRole="alert" style={{ color: colors.danger }}>{error}</Text>}
    </View>
  );
}
