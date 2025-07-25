import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import InputCustom from '../component/InputCustom';
import ButtonCustom from '../component/ButtonCustom';
import SelectCustom from '../component/SelectCustom';
import ImagePicker from '../component/ImagePicker';
import LoadingOverlay from '../component/LoadingOverlay';

interface RegisterScreenProps {
  navigation: any;
}

const roleOptions = [
  { label: 'Farmer', value: 'farmer' },
  { label: 'Cooperative', value: 'cooperative' },
];

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    password: '',
    confirm_password: '',
    address: '',
    role: '',
    profile_image: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual registration logic here
      console.log('Registration attempt with:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      navigation.replace('Dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Create Account"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <ImagePicker
              label="Profile Image"
              imageUri={formData.profile_image}
              onImageSelected={uri => updateFormData('profile_image', uri)}
            />

            <InputCustom
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChangeText={value => updateFormData('full_name', value)}
              error={errors.full_name}
              required
            />

            <InputCustom
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone_number}
              onChangeText={value => updateFormData('phone_number', value)}
              keyboardType="phone-pad"
              error={errors.phone_number}
              required
            />

            <InputCustom
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={value => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              required
            />

            <InputCustom
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={value => updateFormData('password', value)}
              secureTextEntry
              error={errors.password}
              required
            />

            <InputCustom
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirm_password}
              onChangeText={value => updateFormData('confirm_password', value)}
              secureTextEntry
              error={errors.confirm_password}
              required
            />

            <InputCustom
              label="Address"
              placeholder="Enter your address"
              value={formData.address}
              onChangeText={value => updateFormData('address', value)}
              multiline
              numberOfLines={3}
              error={errors.address}
              required
            />

            <SelectCustom
              label="Role"
              value={formData.role}
              onChange={value => updateFormData('role', value)}
              options={roleOptions}
              placeholder="Select your role"
              error={errors.role}
              required
            />

            <ButtonCustom
              title="Register"
              onPress={handleRegister}
              style={styles.registerButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingOverlay visible={loading} message="Creating your account..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  registerButton: {
    marginVertical: theme.spacing.lg,
  },
});

export default RegisterScreen; 