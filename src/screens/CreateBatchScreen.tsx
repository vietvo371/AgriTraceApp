import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import InputCustom from '../component/InputCustom';
import SelectCustom from '../component/SelectCustom';
import DatePicker from '../component/DatePicker';
import LocationPicker from '../component/LocationPicker';
import ImagePicker from '../component/ImagePicker';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';

interface CreateBatchScreenProps {
  navigation: any;
}

const categoryOptions = [
  { label: 'Fruits', value: 'fruits' },
  { label: 'Vegetables', value: 'vegetables' },
  { label: 'Grains', value: 'grains' },
  { label: 'Nuts', value: 'nuts' },
];

const cultivationMethodOptions = [
  { label: 'Organic', value: 'organic' },
  { label: 'Traditional', value: 'traditional' },
];

const CreateBatchScreen: React.FC<CreateBatchScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    category: '',
    product_name: '',
    weight: '',
    variety: '',
    planting_date: new Date(),
    harvest_date: new Date(),
    cultivation_method: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
    farm_image: '',
    product_image: '',
    farmer_image: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.product_name) {
      newErrors.product_name = 'Product name is required';
    }

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }

    if (!formData.variety) {
      newErrors.variety = 'Variety is required';
    }

    if (!formData.cultivation_method) {
      newErrors.cultivation_method = 'Cultivation method is required';
    }

    if (formData.location.latitude === 0 && formData.location.longitude === 0) {
      newErrors.location = 'Location is required';
    }

    if (!formData.farm_image) {
      newErrors.farm_image = 'Farm image is required';
    }

    if (!formData.product_image) {
      newErrors.product_image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBatch = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual batch creation logic here
      console.log('Creating batch with:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      navigation.navigate('QRGenerate', { batchId: '123' }); // Pass actual batch ID
    } catch (error) {
      console.error('Batch creation error:', error);
      // Handle error appropriately
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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Create New Batch"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <SelectCustom
              label="Category"
              value={formData.category}
              onChange={value => updateFormData('category', value)}
              options={categoryOptions}
              placeholder="Select product category"
              error={errors.category}
              required
            />

            <InputCustom
              label="Product Name"
              placeholder="Enter product name"
              value={formData.product_name}
              onChangeText={value => updateFormData('product_name', value)}
              error={errors.product_name}
              required
            />

            <InputCustom
              label="Weight (kg)"
              placeholder="Enter weight in kilograms"
              value={formData.weight}
              onChangeText={value => updateFormData('weight', value)}
              keyboardType="decimal-pad"
              error={errors.weight}
              required
            />

            <InputCustom
              label="Variety"
              placeholder="Enter product variety"
              value={formData.variety}
              onChangeText={value => updateFormData('variety', value)}
              error={errors.variety}
              required
            />

            <DatePicker
              label="Planting Date"
              value={formData.planting_date}
              onChange={date => updateFormData('planting_date', date)}
              maximumDate={new Date()}
              required
            />

            <DatePicker
              label="Harvest Date"
              value={formData.harvest_date}
              onChange={date => updateFormData('harvest_date', date)}
              minimumDate={formData.planting_date}
              maximumDate={new Date()}
              required
            />

            <SelectCustom
              label="Cultivation Method"
              value={formData.cultivation_method}
              onChange={value => updateFormData('cultivation_method', value)}
              options={cultivationMethodOptions}
              placeholder="Select cultivation method"
              error={errors.cultivation_method}
              required
            />

            <LocationPicker
              label="Farm Location"
              value={formData.location}
              onChange={location => updateFormData('location', location)}
              error={errors.location}
              required
            />

            <ImagePicker
              label="Farm Image"
              imageUri={formData.farm_image}
              onImageSelected={uri => updateFormData('farm_image', uri)}
              error={errors.farm_image}
              required
            />

            <ImagePicker
              label="Product Image"
              imageUri={formData.product_image}
              onImageSelected={uri => updateFormData('product_image', uri)}
              error={errors.product_image}
              required
            />

            <ImagePicker
              label="Farmer Image"
              imageUri={formData.farmer_image}
              onImageSelected={uri => updateFormData('farmer_image', uri)}
            />

            <ButtonCustom
              title="Create Batch"
              onPress={handleCreateBatch}
              style={styles.createButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingOverlay visible={loading} message="Creating batch..." />
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
  createButton: {
    marginVertical: theme.spacing.lg,
  },
});

export default CreateBatchScreen; 