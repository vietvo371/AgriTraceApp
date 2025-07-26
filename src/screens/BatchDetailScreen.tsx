import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import Card from '../component/Card';
import Badge from '../component/Badge';
import ReviewCard from '../component/ReviewCard';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';

interface BatchDetailScreenProps {
  navigation: any;
  route: {
    params: {
      batchId: string;
    };
  };
}

// Mock data - replace with actual API call
const mockBatchData = {
  id: '123',
  product_name: 'Organic Mangoes',
  category: 'Fruits',
  weight: 20,
  variety: 'Alphonso',
  planting_date: '2024-01-15',
  harvest_date: '2024-03-15',
  cultivation_method: 'Organic',
  status: 'active' as const,
  location: {
    latitude: 37.78825,
    longitude: -122.4324,
    address: 'Green Valley Farm, California',
  },
  images: {
    farm: 'https://example.com/farm.jpg',
    product: 'https://example.com/product.jpg',
    farmer: 'https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg',
  },
  farmer: {
    name: 'John Doe',
    phone: '+1 234 567 8900',
    email: 'john@example.com',
  },
  stats: {
    total_scans: 48,
    unique_customers: 35,
    average_rating: 4.5,
  },
  reviews: [
    {
      id: '1',
      reviewer: {
        name: 'Alice Smith',
        // avatar: 'https://example.com/avatar1.jpg',
      },
      rating: 5,
      comment: 'Excellent quality mangoes! Very sweet and fresh.',
      date: '2024-03-16',
    },
    {
      id: '2',
      reviewer: {
        name: 'Bob Johnson',
      },
      rating: 4,
      comment: 'Good taste and quality. Will buy again.',
      date: '2024-03-15',
    },
  ],
};

const BatchDetailScreen: React.FC<BatchDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(false);
  const { batchId } = route.params;

  const handleGenerateQR = () => {
    navigation.navigate('QRGenerate', { batchId });
  };

  const handleEditBatch = () => {
    // TODO: Implement edit functionality
    console.log('Edit batch:', batchId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Batch Details"
        onBack={() => navigation.goBack()}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.productName}>{mockBatchData.product_name}</Text>
              <View style={styles.categoryContainer}>
                <Icon name="tag-outline" size={16} color={theme.colors.textLight} />
                <Text style={styles.category}>{mockBatchData.category}</Text>
              </View>
            </View>
            <Badge
              text={mockBatchData.status.toUpperCase()}
              variant={mockBatchData.status === 'active' ? 'success' : 'error'}
            />
          </View>
        </View>

        {/* Product Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="information-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Product Information</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                <Icon name="weight-kilogram" size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>{mockBatchData.weight} kg</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: theme.colors.secondary + '15' }]}>
                <Icon name="leaf" size={20} color={theme.colors.secondary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Method</Text>
                <Text style={styles.infoValue}>{mockBatchData.cultivation_method}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: theme.colors.accent + '15' }]}>
                <Icon name="calendar-blank-outline" size={20} color={theme.colors.accent} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Planted</Text>
                <Text style={styles.infoValue}>{mockBatchData.planting_date}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: theme.colors.success + '15' }]}>
                <Icon name="calendar-check-outline" size={20} color={theme.colors.success} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Harvested</Text>
                <Text style={styles.infoValue}>{mockBatchData.harvest_date}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Farm Location */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="map-marker-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Farm Location</Text>
          </View>
          <View style={styles.mapContainer}>
            <View style={styles.addressContainer}>
              <Icon name="home-variant" size={20} color={theme.colors.primary} />
              <Text style={styles.address}>{mockBatchData.location.address}</Text>
            </View>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: mockBatchData.location.latitude,
                longitude: mockBatchData.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: mockBatchData.location.latitude,
                  longitude: mockBatchData.location.longitude,
                }}
              />
            </MapView>
          </View>
        </View>

        {/* Farmer Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="account-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Farmer Information</Text>
          </View>
          <View style={styles.farmerCard}>
            <Image
              source={{ uri: mockBatchData.images.farmer }}
              style={styles.farmerImage}
            />
            <View style={styles.farmerDetails}>
              <Text style={styles.farmerName}>{mockBatchData.farmer.name}</Text>
              <View style={styles.contactItem}>
                <Icon name="phone-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.farmerContact}>{mockBatchData.farmer.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Icon name="email-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.farmerContact}>{mockBatchData.farmer.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="chart-bar" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Statistics</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                <Icon name="qrcode-scan" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.statValue}>{mockBatchData.stats.total_scans}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.secondary + '15' }]}>
                <Icon name="account-group-outline" size={24} color={theme.colors.secondary} />
              </View>
              <Text style={styles.statValue}>{mockBatchData.stats.unique_customers}</Text>
              <Text style={styles.statLabel}>Customers</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '15' }]}>
                <Icon name="star-outline" size={24} color={theme.colors.warning} />
              </View>
              <Text style={styles.statValue}>{mockBatchData.stats.average_rating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="comment-text-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
          </View>
          <View style={styles.reviewsContainer}>
            {mockBatchData.reviews.map(review => (
              <ReviewCard
                key={review.id}
                reviewer={review.reviewer}
                rating={review.rating}
                comment={review.comment}
                date={review.date}
              />
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <ButtonCustom
            title="Generate QR Code"
            onPress={handleGenerateQR}
            style={styles.actionButton}
            icon="qrcode"
          />
          <ButtonCustom
            title="Edit Batch"
            onPress={handleEditBatch}
            variant="outline"
            style={styles.actionButton}
            icon="pencil"
          />
        </View>
      </ScrollView>
      <LoadingOverlay visible={loading} />
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
  headerSection: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  productName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  section: {
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
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '45%',
    flex: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  mapContainer: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  address: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
  },
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  farmerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: theme.spacing.md,
  },
  farmerDetails: {
    flex: 1,
  },
  farmerName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  farmerContact: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
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
  reviewsContainer: {
    gap: 12,
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    borderRadius: theme.borderRadius.lg,
  },
});

export default BatchDetailScreen; 