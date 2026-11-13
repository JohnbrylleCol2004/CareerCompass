import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';
import { File } from 'expo-file-system';
import { Platform } from 'react-native';
import { validateProfilePhoto, MAX_PHOTO_BYTES } from '../utils/profileFields.mjs';

const BUCKET = 'avatars';

export async function checkProfilePhoto(asset) {
  const size = Platform.OS === 'web'
    ? (asset.file?.size ?? asset.fileSize ?? (await (await fetch(asset.uri)).blob()).size)
    : new File(asset.uri).size;
  const error = validateProfilePhoto(asset, size);
  if (error) throw new Error(error);
}

export async function uploadProfilePhoto(asset) {
  await checkProfilePhoto(asset);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Please sign in again to upload a photo.');

  const context = ImageManipulator.manipulate(asset.uri);
  context.resize(asset.width >= asset.height ? { width: 512 } : { height: 512 });
  const rendered = await context.renderAsync();
  const image = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.8, base64: true });
  if (!image.base64) throw new Error('Unable to read this photo. Please choose another image.');
  const bytes = decode(image.base64);
  if (bytes.byteLength > MAX_PHOTO_BYTES) throw new Error('Choose a photo no larger than 2 MB.');

  const path = `${data.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: 'image/jpeg',
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);
  return path;
}

export async function getProfilePhotoUrl(path) {
  if (!path) return null;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error) {
    // Older mobile releases stored images here. New uploads always use avatars.
    const legacy = await supabase.storage.from('profile-photos').createSignedUrl(path, 3600);
    if (legacy.error) throw new Error(error.message);
    return legacy.data.signedUrl;
  }
  return data.signedUrl;
}

export async function getProfilePhotoPath(userId) {
  if (!userId) return null;
  const { data, error } = await supabase.from('profiles')
    .select('profile_image_path').eq('id', userId).single();
  if (error) throw new Error(error.message);
  return data?.profile_image_path || null;
}
