import {
  launchImageLibrary,
  launchCamera,
  Asset,
} from 'react-native-image-picker';

export const useImagePicker = () => {
  /**
   * Opens the image library and returns the first selected asset.
   */
  const pickImage = async (
    options?: Partial<{
      mediaType: 'photo' | 'video';
      includeBase64: boolean;
      maxWidth: number;
      maxHeight: number;
      quality: number;
    }>,
  ): Promise<Asset | undefined> => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (result.didCancel || result.errorCode) return undefined;
      return result.assets && result.assets[0];
    } catch (error) {
      console.error('Error picking image:', error);
      return undefined;
    }
  };

  /**
   * Opens the camera and returns the captured asset.
   */
  const captureImage = async (
    options?: Partial<{
      mediaType: 'photo' | 'video';
      includeBase64: boolean;
      maxWidth: number;
      maxHeight: number;
      quality: number;
    }>,
  ): Promise<Asset | undefined> => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });
      if (result.didCancel || result.errorCode) return undefined;
      return result.assets && result.assets[0];
    } catch (error) {
      console.error('Error capturing image:', error);
      return undefined;
    }
  };

  return {pickImage, captureImage};
};
