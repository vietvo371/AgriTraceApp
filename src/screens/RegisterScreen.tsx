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
import { useAuth } from '../contexts/AuthContext';
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
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    password: '',
    password_confirmation: '',
    address: '',
    role: 'farmer',
    profile_image: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name) {
      newErrors.full_name = 'Họ và tên là bắt buộc';
    }

    if (!formData.phone_number) {
      newErrors.phone_number = 'Số điện thoại là bắt buộc';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Vui lòng nhập số điện thoại hợp lệ';
    }

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Mật khẩu không khớp';
    }

    if (!formData.address) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    console.log('Proceeding with registration...');
    setLoading(true);
    try {
      await signUp(formData);
      navigation.replace('Login');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Xử lý lỗi validation từ API
      if (error.errors) {
        // Cập nhật tất cả các lỗi từ API
        const newErrors: Record<string, string> = {};
        Object.keys(error.errors).forEach(field => {
          newErrors[field] = error.errors[field][0];
        });
        setErrors(newErrors);
      } else {
        // Xử lý các lỗi khác (network, timeout...)
        setErrors({
          email: error.message
        });
      }
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
                <Text style={styles.title}>Tham gia AgriTrace</Text>
                <Text style={styles.subtitle}>
                  Tạo tài khoản để bắt đầu theo dõi sản phẩm nông nghiệp của bạn
                </Text>

                <ImagePicker
                  label="Ảnh đại diện"
                  imageUri={formData.profile_image}
                  onImageSelected={uri => updateFormData('profile_image', uri)}
                  containerStyle={styles.imagePicker}
                />

                <InputCustom
                  label="Họ và tên"
                  placeholder="Nhập họ và tên của bạn"
                  value={formData.full_name}
                  onChangeText={value => updateFormData('full_name', value)}
                  error={errors.full_name}
                  required
                  leftIcon="account-outline"
                  containerStyle={styles.input}
                />

                <InputCustom
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại của bạn"
                  value={formData.phone_number}
                  onChangeText={value => updateFormData('phone_number', value)}
                  keyboardType="phone-pad"
                  error={errors.phone_number}
                  required
                  leftIcon="phone-outline"
                  containerStyle={styles.input}
                />
                <InputCustom
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ của bạn"
                  value={formData.address}
                  onChangeText={value => updateFormData('address', value)}
                  keyboardType="default"
                  error={errors.address}
                  required
                  leftIcon="map-marker-outline"
                  containerStyle={styles.input}
                />

                <InputCustom
                  label="Email"
                  placeholder="Nhập email của bạn"
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
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu của bạn"
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
                  label="Xác nhận mật khẩu"
                  placeholder="Xác nhận mật khẩu của bạn"
                  value={formData.password_confirmation}
                  onChangeText={value => updateFormData('password_confirmation', value)}
                  secureTextEntry={!showConfirmPassword}
                  error={errors.password_confirmation}
                  required
                  leftIcon="lock-check-outline"
                  rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  containerStyle={styles.input}
                />

                {/* <SelectCustom
                  label="Role"
                  value={formData.role}
                  onChange={value => updateFormData('role', value)}
                  options={roleOptions}
                  placeholder="Select your role"
                  error={errors.role}
                  required
                  containerStyle={styles.input}
                /> */}

                <ButtonCustom
                  title="Tạo tài khoản"
                  onPress={handleRegister}
                  style={styles.registerButton}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
      <LoadingOverlay visible={loading} message="Đang tạo tài khoản..." />
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