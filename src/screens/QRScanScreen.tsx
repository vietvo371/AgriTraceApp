import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
} from 'react-native';
import { theme } from '../theme/colors';
import QRScanner from '../component/QRScanner';
import Card from '../component/Card';
import Rating from '../component/Rating';
import InputCustom from '../component/InputCustom';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';

interface QRScanScreenProps {
  navigation: any;
}

// Mock data - replace with actual API call
const mockProductData = {
  id: '123',
  product_name: 'Organic Mangoes',
  category: 'Fruits',
  weight: 20,
  harvest_date: '2024-03-15',
  cultivation_method: 'Organic',
  farmer: {
    name: 'John Doe',
    location: 'Green Valley Farm, California',
  },
  images: {
    product: 'https://example.com/product.jpg',
  },
};

const QRScanScreen: React.FC<QRScanScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [review, setReview] = useState({
    rating: 0,
    comment: '',
  });
  const [error, setError] = useState('');

  const handleScan = async (data: string) => {
    setLoading(true);
    try {
      // TODO: Implement actual API call to fetch product data
      console.log('Scanned QR code:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setScannedData(mockProductData);
      setShowReview(true);
    } catch (error) {
      console.error('Scan error:', error);
      setError('Failed to fetch product information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (review.rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual review submission
      console.log('Submitting review:', review);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      navigation.goBack();
    } catch (error) {
      console.error('Review submission error:', error);
      setError('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <QRScanner
        onScan={handleScan}
        onClose={() => navigation.goBack()}
      />

      <Modal
        visible={showReview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReview(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {scannedData && (
                <>
                  <Card style={styles.productCard}>
                    <Text style={styles.productName}>
                      {scannedData.product_name}
                    </Text>
                    <Text style={styles.productInfo}>
                      {scannedData.category} • {scannedData.weight}kg
                    </Text>
                    <Text style={styles.farmerInfo}>
                      Grown by {scannedData.farmer.name}
                    </Text>
                    <Text style={styles.farmerInfo}>
                      {scannedData.farmer.location}
                    </Text>
                  </Card>

                  <View style={styles.reviewSection}>
                    <Text style={styles.reviewTitle}>Write a Review</Text>
                    <Text style={styles.reviewSubtitle}>
                      Share your experience with this product
                    </Text>

                    <View style={styles.ratingContainer}>
                      <Rating
                        value={review.rating}
                        onChange={rating => {
                          setReview(prev => ({ ...prev, rating }));
                          setError('');
                        }}
                        size="large"
                      />
                    </View>

                    <InputCustom
                      label="Your Comment"
                      placeholder="Tell us what you think about this product..."
                      value={review.comment}
                      onChangeText={comment =>
                        setReview(prev => ({ ...prev, comment }))
                      }
                      multiline
                      numberOfLines={4}
                    />

                    {error ? (
                      <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    <View style={styles.actions}>
                      <ButtonCustom
                        title="Submit Review"
                        onPress={handleSubmitReview}
                        style={styles.submitButton}
                      />
                      <ButtonCustom
                        title="Cancel"
                        variant="outline"
                        onPress={() => setShowReview(false)}
                      />
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '80%',
  },
  productCard: {
    margin: theme.spacing.lg,
  },
  productName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  productInfo: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  farmerInfo: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs / 2,
  },
  reviewSection: {
    padding: theme.spacing.lg,
  },
  reviewTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  reviewSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  actions: {
    marginTop: theme.spacing.lg,
  },
  submitButton: {
    marginBottom: theme.spacing.md,
  },
});

export default QRScanScreen; 