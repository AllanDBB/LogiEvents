// client/utils/imageUpload.ts
import * as ImagePicker from 'expo-image-picker';

// Image picker options
const imagePickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

/**
 * Request permission to access photo library
 */
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};

/**
 * Pick image from gallery
 */
export const pickImageFromGallery = async (): Promise<string | null> => {
  try {
    const permissionGranted = await requestMediaLibraryPermission();
    if (!permissionGranted) {
      console.error('Permission to access media library was denied');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
    
    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }
    
    return result.assets[0].uri;
  } catch (error) {
    console.error('Error picking image from gallery:', error);
    return null;
  }
};