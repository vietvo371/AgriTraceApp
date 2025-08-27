import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import InputCustom from '../component/InputCustom';
import SelectCustom from '../component/SelectCustom';
import DatePicker from '../component/DatePicker';
import LocationPicker from '../component/LocationPicker';
import ImagePicker from '../component/ImagePicker';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import { LinearGradient } from 'react-native-linear-gradient';
import api from '../utils/Api';

interface CreateBatchScreenProps {
  navigation: any;
}

const cultivationMethodOptions = [
  { label: 'Organic', value: 'organic', icon: 'leaf' },
  { label: 'Traditional', value: 'traditional', icon: 'sprout' },
  { label: 'Hydroponic', value: 'hydroponic', icon: 'water' },
  { label: 'Aeroponic', value: 'aeroponic', icon: 'air-filter' },
  { label: 'Vertical Farming', value: 'vertical', icon: 'arrow-up-down' },
];

const CreateBatchScreen: React.FC<CreateBatchScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category_id: '',
    product_name: '',
    weight: '',
    variety: '',
    planting_date: new Date(),
    harvest_date: new Date(),
    cultivation_method: '',
    location: {
      location: '', // City, Country
      gps_coordinates: '', // "lat,long" format
    },
    farm_image: '',
    product_image: '',
  });
  const [category, setCategory] = useState<any>([]);
  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await api.get('/categories');
      setCategory(response.data.data);
      setCategoryOptions(response.data.data.map((category: any) => ({
        label: category.name,
        value: category.id,
      })));
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Initial animation
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category_id) {
      newErrors.category_id = 'Danh mục là bắt buộc';
    }
    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Tên sản phẩm là bắt buộc';
    }
    if (!formData.weight) {
      newErrors.weight = 'Khối lượng là bắt buộc';
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = 'Vui lòng nhập khối lượng hợp lệ';
    }
    if (!formData.variety.trim()) {
      newErrors.variety = 'Giống là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cultivation_method) {
      newErrors.cultivation_method = 'Phương pháp canh tác là bắt buộc';
    }
    if (!formData.location.location || !formData.location.gps_coordinates) {
      newErrors.location = 'Vị trí là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.farm_image) {
      newErrors.farm_image = 'Ảnh trang trại là bắt buộc';
    }
    if (!formData.product_image) {
      newErrors.product_image = 'Ảnh sản phẩm là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateBatch = async () => {
    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    try {
      // Tạo FormData object để gửi file
      const formDataToSend = new FormData();

      // Thêm các thông tin cơ bản
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('product_name', formData.product_name);
      formDataToSend.append('weight', formData.weight.toString());
      formDataToSend.append('variety', formData.variety);
      formDataToSend.append('planting_date', formData.planting_date.toISOString());
      formDataToSend.append('harvest_date', formData.harvest_date.toISOString());
      formDataToSend.append('cultivation_method', formData.cultivation_method);
      formDataToSend.append('location[location]', formData.location.location);
      formDataToSend.append('location[gps_coordinates]', formData.location.gps_coordinates);

      // Thêm các file ảnh
      if (formData.farm_image) {
        const farmImageName = formData.farm_image.split('/').pop() || 'farm_image.jpg';
        formDataToSend.append('farm_image', {
          uri: formData.farm_image,
          type: 'image/jpeg',
          name: farmImageName
        });
      }

      if (formData.product_image) {
        const productImageName = formData.product_image.split('/').pop() || 'product_image.jpg';
        formDataToSend.append('product_image', {
          uri: formData.product_image,
          type: 'image/jpeg',
          name: productImageName
        });
      }



      console.log('Creating batch with:', formDataToSend);
      const response = await api.post('/batches', formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response);
      console.log(response.data.data.id);
     navigation.navigate('BatchDetail', { batchId : response.data.data.id });

    } catch (error: any) {
      console.error('Batch creation error:', error.response);
      Alert.alert(
        'Lỗi',
        'Tạo lô thất bại. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: `${(currentStep / 3) * 100}%` }
          ]}
        />
      </View>
      <Text style={styles.progressText}>Bước {currentStep}/3</Text>
    </View>
  );

  const renderStep1 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: slideAnim,
          transform: [{
            translateY: Animated.multiply(slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            }), 1)
          }]
        }
      ]}>

      <View style={styles.formSection}>
        <View style={styles.sectionHeader}>
          <Icon name="cube-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>
        </View>

        <Text style={styles.sectionDescription}>
          Nhập các thông tin cơ bản về sản phẩm nông nghiệp của bạn
        </Text>

        <SelectCustom
          label="Danh mục"
          value={formData.category_id}
          onChange={value => updateFormData('category_id', value)}
          options={categoryOptions}
          placeholder="Chọn danh mục sản phẩm"
          error={errors.category_id}
          required
        />

        <InputCustom
          label="Tên sản phẩm"
          placeholder="VD: Gạo hữu cơ, Cà phê cao cấp"
          value={formData.product_name}
          onChangeText={value => updateFormData('product_name', value)}
          error={errors.product_name}
          required
          leftIcon="tag-outline"
        />

        <InputCustom
          label="Khối lượng (kg)"
          placeholder="Nhập khối lượng (kg)"
          value={formData.weight}
          onChangeText={value => updateFormData('weight', value)}
          keyboardType="decimal-pad"
          error={errors.weight}
          required
          leftIcon="weight-kilogram"
        />

        <InputCustom
          label="Giống"
          placeholder="VD: Gạo Jasmine, Cà phê Arabica"
          value={formData.variety}
          onChangeText={value => updateFormData('variety', value)}
          error={errors.variety}
          required
          leftIcon="leaf-maple"
        />
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.formSection}>
        <View style={styles.sectionHeader}>
          <Icon name="sprout-outline" size={24} color={theme.colors.success} />
          <Text style={styles.sectionTitle}>Chi tiết canh tác</Text>
        </View>

        <Text style={styles.sectionDescription}>
          Xác định thời gian và phương pháp canh tác sản phẩm
        </Text>

        <View style={styles.dateItem}>
          <DatePicker
            label="Ngày gieo trồng"
            value={formData.planting_date}
            onChange={date => updateFormData('planting_date', date)}
            maximumDate={new Date()}
            required
          />
        </View>

        <View style={styles.dateItem}>
          <DatePicker
            label="Ngày thu hoạch"
            value={formData.harvest_date}
            onChange={date => updateFormData('harvest_date', date)}
            minimumDate={formData.planting_date}
            maximumDate={new Date()}
            required
          />
        </View>

        <SelectCustom
          label="Phương pháp canh tác"
          value={formData.cultivation_method}
          onChange={value => updateFormData('cultivation_method', value)}
          options={cultivationMethodOptions}
          placeholder="Chọn phương pháp canh tác"
          error={errors.cultivation_method}
          required
        />

        <LocationPicker
          label="Vị trí trang trại"
          value={formData.location}
          onChange={location => updateFormData('location', location)}
          error={errors.location}
          required
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.formSection}>
        <View style={styles.sectionHeader}>
          <Icon name="image-outline" size={24} color={theme.colors.info} />
          <Text style={styles.sectionTitle}>Hình ảnh minh chứng</Text>
        </View>

        <Text style={styles.sectionDescription}>
          Tải ảnh minh chứng cho quy trình canh tác và chất lượng sản phẩm
        </Text>

        <View style={styles.imagesGrid}>
          <View style={styles.imageItem}>
            <ImagePicker
              label="Ảnh trang trại"
              imageUri={formData.farm_image}
              onImageSelected={uri => updateFormData('farm_image', uri)}
              error={errors.farm_image}
              required
            />
            <Text style={styles.imageHint}>Chụp cánh đồng/trang trại của bạn</Text>
          </View>

          <View style={styles.imageItem}>
            <ImagePicker
              label="Ảnh sản phẩm"
              imageUri={formData.product_image}
              onImageSelected={uri => updateFormData('product_image', uri)}
              error={errors.product_image}
              required
            />
            <Text style={styles.imageHint}>Chụp sản phẩm sau thu hoạch</Text>
          </View>

        </View>
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryHeader}>
          <Icon name="check-circle" size={24} color={theme.colors.success} />
          <Text style={styles.summaryTitle}>Sẵn sàng tạo lô</Text>
        </View>

        <Text style={styles.summaryDescription}>
          Kiểm tra lại thông tin và tạo lô sản phẩm. Điều này giúp theo dõi sản phẩm và hỗ trợ truy xuất nguồn gốc cho người tiêu dùng.
        </Text>

        <View style={styles.summaryPoints}>
          <View style={styles.summaryPoint}>
            <Icon name="check" size={16} color={theme.colors.success} />
            <Text style={styles.summaryPointText}>Thông tin sản phẩm đã xác minh</Text>
          </View>
          <View style={styles.summaryPoint}>
            <Icon name="check" size={16} color={theme.colors.success} />
            <Text style={styles.summaryPointText}>Tọa độ vị trí đã thiết lập</Text>
          </View>
          <View style={styles.summaryPoint}>
            <Icon name="check" size={16} color={theme.colors.success} />
            <Text style={styles.summaryPointText}>Hình ảnh đã tải lên</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.previousButton}
            onPress={handlePreviousStep}>
            <Icon name="chevron-left" size={20} color={theme.colors.primary} />
            <Text style={styles.previousButtonText}>Quay lại</Text>
          </TouchableOpacity>
        )}

        {currentStep < 3 ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Tiếp tục</Text>
            <Icon name="chevron-right" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateBatch}>
            <Icon name="check" size={20} color={theme.colors.white} />
            <Text style={styles.createButtonText}>Tạo lô</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary + '08', theme.colors.white]}
        style={styles.backgroundGradient}>

        <Header
          title="Tạo lô mới"
          style={styles.header}
          onBack={() => navigation.goBack()}
        />

        {renderProgressBar()}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>

            {renderCurrentStep()}
          </ScrollView>
        </KeyboardAvoidingView>

        {renderNavigationButtons()}

        <LoadingOverlay visible={loading} message="Đang tạo lô..." />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.lg,
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
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E6EBE6',
    borderRadius: 2,
    marginRight: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Roboto-Medium',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  stepContainer: {
    flex: 1,
  },

  // Form Styles
  formSection: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    borderRadius: 20,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  sectionDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
    marginLeft: theme.spacing.xl + 24,
  },
  dateRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  dateItem: {
    flex: 1,
  },
  imagesGrid: {
    gap: theme.spacing.lg,
  },
  imageItem: {
    marginBottom: theme.spacing.md,
  },
  imageHint: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
  summarySection: {
    backgroundColor: theme.colors.primary + '08',
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary + '20',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary,
    marginLeft: theme.spacing.md,
  },
  summaryDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
    textAlign: 'center',
  },
  summaryPoints: {
    gap: theme.spacing.sm,
  },
  summaryPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  summaryPointText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
  },

  // Navigation Styles
  navigationContainer: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingHorizontal: 24,
    marginTop: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  previousButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  previousButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
  },
  nextButton: {
    flex: 2,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
  },
  nextButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
  },
  createButton: {
    flex: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
  },
  createButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
  },
});

export default CreateBatchScreen; 