import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import ImagePicker from '../component/ImagePicker';
import InputCustom from '../component/InputCustom';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';

interface ProfileScreenProps {
  navigation: any;
}

// Mock data - replace with actual API call
const mockUserData = {
  id: '123',
  full_name: 'John Doe',
  email: 'john@example.com',
  phone_number: '+1 234 567 8900',
  address: 'Green Valley Farm, California',
  role: 'farmer',
  profile_image: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
  stats: {
    total_batches: 12,
    active_batches: 8,
    total_scans: 156,
    average_rating: 4.8,
  },
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: mockUserData.full_name,
    email: mockUserData.email,
    phone_number: mockUserData.phone_number,
    address: mockUserData.address,
    profile_image: mockUserData.profile_image,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      full_name: mockUserData.full_name,
      email: mockUserData.email,
      phone_number: mockUserData.phone_number,
      address: mockUserData.address,
      profile_image: mockUserData.profile_image,
    });
    setErrors({});
    setIsEditing(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual profile update
      console.log('Updating profile with:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual logout logic
            navigation.replace('Login');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title=""
        showBack={false}
        rightComponent={
          isEditing ? (
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Icon name="pencil-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          )
        }
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            <ImagePicker
              imageUri={formData.profile_image}
              onImageSelected={uri =>
                setFormData(prev => ({ ...prev, profile_image: uri }))
              }
              error={errors.profile_image}
              isCircle
              size={120}
              containerStyle={styles.imagePicker}
            />
            {!isEditing && (
              <View style={styles.roleContainer}>
                <Icon name="shield-account-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.roleText}>
                  {mockUserData.role.charAt(0).toUpperCase() +
                    mockUserData.role.slice(1)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Icon name="package-variant-closed" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.statValue}>{mockUserData.stats.total_batches}</Text>
                <Text style={styles.statLabel}>Total Batches</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '15' }]}>
                  <Icon name="package-variant" size={24} color={theme.colors.success} />
                </View>
                <Text style={styles.statValue}>{mockUserData.stats.active_batches}</Text>
                <Text style={styles.statLabel}>Active Batches</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.secondary + '15' }]}>
                  <Icon name="qrcode-scan" size={24} color={theme.colors.secondary} />
                </View>
                <Text style={styles.statValue}>{mockUserData.stats.total_scans}</Text>
                <Text style={styles.statLabel}>Total Scans</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '15' }]}>
                  <Icon name="star-outline" size={24} color={theme.colors.warning} />
                </View>
                <Text style={styles.statValue}>{mockUserData.stats.average_rating}</Text>
                <Text style={styles.statLabel}>Avg Rating</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Icon name="account-details-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.form}>
            <InputCustom
              label="Full Name"
              value={formData.full_name}
              onChangeText={value =>
                setFormData(prev => ({ ...prev, full_name: value }))
              }
              error={errors.full_name}
              editable={isEditing}
              required
            />

            <InputCustom
              label="Email"
              value={formData.email}
              onChangeText={value =>
                setFormData(prev => ({ ...prev, email: value }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              editable={isEditing}
              required
            />

            <InputCustom
              label="Phone Number"
              value={formData.phone_number}
              onChangeText={value =>
                setFormData(prev => ({ ...prev, phone_number: value }))
              }
              keyboardType="phone-pad"
              error={errors.phone_number}
              editable={isEditing}
              required
            />

            <InputCustom
              label="Address"
              value={formData.address}
              onChangeText={value =>
                setFormData(prev => ({ ...prev, address: value }))
              }
              multiline
              numberOfLines={3}
              error={errors.address}
              editable={isEditing}
              required
            />
          </View>

          {isEditing && (
            <ButtonCustom
              title="Save Changes"
              onPress={handleSave}
              style={styles.saveButton}
            />
          )}

          <ButtonCustom
            title="Logout"
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
      <LoadingOverlay visible={loading} message="Updating profile..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  profileHeader: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.md,
  },
  roleText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  statsSection: {
    marginTop: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  formSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  form: {
    gap: 16,
  },
  editButton: {
    padding: 8,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
  },
  saveButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  logoutButton: {
    marginTop: theme.spacing.md,
  },
  imagePicker: {
    marginBottom: theme.spacing.md,
  },
});

export default ProfileScreen; 