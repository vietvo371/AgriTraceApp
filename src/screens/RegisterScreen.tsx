import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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

const { width } = Dimensions.get('window');

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      <LinearGradient
        colors={[theme.colors.primary + '20', theme.colors.white]}
        style={styles.gradient}>
        <Header
          title=""
          onBack={() => navigation.goBack()}
          containerStyle={styles.header}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.formContainer}>
                <Text style={styles.title}>Join AgriTrace</Text>
                <Text style={styles.subtitle}>
                  Create an account to start tracking your agricultural products
                </Text>

                <ImagePicker
                  label="Profile Image"
                  imageUri={formData.profile_image}
                  onImageSelected={uri => updateFormData('profile_image', uri)}
                  containerStyle={styles.imagePicker}
                />

                <InputCustom
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChangeText={value => updateFormData('full_name', value)}
                  error={errors.full_name}
                  required
                  leftIcon="account-outline"
                  containerStyle={styles.input}
                />

                <InputCustom
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={formData.phone_number}
                  onChangeText={value => updateFormData('phone_number', value)}
                  keyboardType="phone-pad"
                  error={errors.phone_number}
                  required
                  leftIcon="phone-outline"
                  containerStyle={styles.input}
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
                  leftIcon="email-outline"
                  containerStyle={styles.input}
                />

                <InputCustom
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={value => updateFormData('password', value)}
                  secureTextEntry={!showPassword}
                  error={errors.password}
                  required
                  leftIcon="lock-outline"
                  rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  containerStyle={styles.input}
                />

                <InputCustom
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirm_password}
                  onChangeText={value => updateFormData('confirm_password', value)}
                  secureTextEntry={!showConfirmPassword}
                  error={errors.confirm_password}
                  required
                  leftIcon="lock-check-outline"
                  rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  containerStyle={styles.input}
                />

                <SelectCustom
                  label="Role"
                  value={formData.role}
                  onChange={value => updateFormData('role', value)}
                  options={roleOptions}
                  placeholder="Select your role"
                  error={errors.role}
                  required
                  containerStyle={styles.input}
                />

                <ButtonCustom
                  title="Create Account"
                  onPress={handleRegister}
                  style={styles.registerButton}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
      <LoadingOverlay visible={loading} message="Creating your account..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  gradient: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
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
  formContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  imagePicker: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  registerButton: {
    marginTop: theme.spacing.lg,
  },
});

export default RegisterScreen; 