import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { theme } from '../theme/colors';

interface ImagePickerProps {
  onImageSelected: (uri: string) => void;
  imageUri?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  onImageSelected,
  imageUri,
  label,
  error,
  required = false,
}) => {
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'AgriTrace needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      let errorMessage = 'Something went wrong while picking the image';
      switch (response.errorCode) {
        case 'camera_unavailable':
          errorMessage = 'Camera not available on device';
          break;
        case 'permission':
          errorMessage = 'Permission not granted';
          break;
        case 'others':
          errorMessage = response.errorMessage || 'Unknown error occurred';
          break;
      }
      Alert.alert('Error', errorMessage);
      return;
    }

    if (response.assets && response.assets[0]?.uri) {
      onImageSelected(response.assets[0].uri);
    } else {
      Alert.alert('Error', 'No image was selected');
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return;
    }

    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: false,
        includeBase64: false,
      });
      handleImagePickerResponse(result);
    } catch (error) {
      console.error('Camera launch error:', error);
      Alert.alert('Error', 'Failed to launch camera');
    }
  };

  const handleChoosePhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
        includeBase64: false,
      });
      handleImagePickerResponse(result);
    } catch (error) {
      console.error('Image library error:', error);
      Alert.alert('Error', 'Failed to open photo gallery');
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[styles.imageContainer, error ? styles.errorBorder : {}]}>
        {imageUri ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              style={styles.changeButton}
              onPress={handleChoosePhoto}>
              <Text style={styles.changeButtonText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleTakePhoto}>
              <Icon name="camera" size={24} color={theme.colors.primary} />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleChoosePhoto}>
              <Icon name="image" size={24} color={theme.colors.primary} />
              <Text style={styles.buttonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.error,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
  },
  errorBorder: {
    borderColor: theme.colors.error,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.overlay,
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  changeButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
  },
  buttonContainer: {
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  buttonText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
  },
  errorText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default ImagePicker; 