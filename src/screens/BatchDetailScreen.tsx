import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
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
  certification: {
    type: 'VietGAP',
    number: 'VG-123456',
    validUntil: '2025-03-15',
  },
  quality_tests: [
    {
      date: '2024-03-10',
      type: 'Pesticide Residue',
      result: 'Passed',
      lab: 'ABC Testing Lab',
    }
  ],
  traceability: {
    batch_code: 'BT2024031501',
    packaging_date: '2024-03-15',
    best_before: '2024-03-30',
  },
  sustainability: {
    water_usage: '120L/kg',
    carbon_footprint: '0.8kg CO2/kg',
    pesticide_usage: 'Minimal - Organic methods',
  },
  reviews: [
    {
      id: '1',
      reviewer: {
        name: 'Alice Smith',
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

  const renderInfoItem = (icon: string, label: string, value: string, color: string) => (
    <View style={styles.infoItem}>
      <View style={[styles.infoIcon, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const renderCertificationItem = (icon: string, title: string, value: string, color: string) => (
    <View style={styles.certificationItem}>
      <View style={[styles.certificationIcon, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.certificationContent}>
        <Text style={styles.certificationTitle}>{title}</Text>
        <Text style={styles.certificationValue}>{value}</Text>
      </View>
    </View>
  );

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
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
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
          <View style={styles.batchInfoContainer}>
            <Text style={styles.batchCode}>Batch Code: {mockBatchData.traceability.batch_code}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statsCard, styles.elevation]}>
            <Icon name="qrcode-scan" size={24} color={theme.colors.primary} />
            <Text style={styles.statsValue}>{mockBatchData.stats.total_scans}</Text>
            <Text style={styles.statsLabel}>Total Scans</Text>
          </View>
          <View style={[styles.statsCard, styles.elevation]}>
            <Icon name="account-group" size={24} color={theme.colors.secondary} />
            <Text style={styles.statsValue}>{mockBatchData.stats.unique_customers}</Text>
            <Text style={styles.statsLabel}>Customers</Text>
          </View>
          <View style={[styles.statsCard, styles.elevation]}>
            <Icon name="star" size={24} color={theme.colors.warning} />
            <Text style={styles.statsValue}>{mockBatchData.stats.average_rating}</Text>
            <Text style={styles.statsLabel}>Rating</Text>
          </View>
        </View>

        {/* Traceability Information */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="timeline-text" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Traceability Information</Text>
          </View>
          <View style={styles.timelineContainer}>
            {renderCertificationItem(
              'calendar-check',
              'Packaging Date',
              mockBatchData.traceability.packaging_date,
              theme.colors.primary
            )}
            {renderCertificationItem(
              'calendar-clock',
              'Best Before',
              mockBatchData.traceability.best_before,
              theme.colors.warning
            )}
            {renderCertificationItem(
              'certificate',
              'VietGAP Certification',
              `${mockBatchData.certification.number} (Valid until ${mockBatchData.certification.validUntil})`,
              theme.colors.success
            )}
          </View>
        </View>

        {/* Product Information */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="information" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Product Information</Text>
          </View>
          <View style={styles.infoGrid}>
            {renderInfoItem('weight-kilogram', 'Weight', `${mockBatchData.weight} kg`, theme.colors.primary)}
            {renderInfoItem('leaf', 'Method', mockBatchData.cultivation_method, theme.colors.secondary)}
            {renderInfoItem('calendar-blank', 'Planted', mockBatchData.planting_date, theme.colors.accent)}
            {renderInfoItem('calendar-check', 'Harvested', mockBatchData.harvest_date, theme.colors.success)}
          </View>
        </View>

        {/* Sustainability Metrics */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="leaf-circle" size={24} color={theme.colors.success} />
            <Text style={styles.sectionTitle}>Sustainability Metrics</Text>
          </View>
          <View style={styles.sustainabilityGrid}>
            {renderCertificationItem(
              'water',
              'Water Usage',
              mockBatchData.sustainability.water_usage,
              theme.colors.primary
            )}
            {renderCertificationItem(
              'molecule-co2',
              'Carbon Footprint',
              mockBatchData.sustainability.carbon_footprint,
              theme.colors.secondary
            )}
            {renderCertificationItem(
              'flask',
              'Pesticide Usage',
              mockBatchData.sustainability.pesticide_usage,
              theme.colors.success
            )}
          </View>
        </View>

        {/* Farm Location */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="map-marker" size={24} color={theme.colors.primary} />
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
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="account" size={24} color={theme.colors.primary} />
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
                <Icon name="phone" size={16} color={theme.colors.primary} />
                <Text style={styles.farmerContact}>{mockBatchData.farmer.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Icon name="email" size={16} color={theme.colors.primary} />
                <Text style={styles.farmerContact}>{mockBatchData.farmer.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={[styles.section, styles.elevation]}>
          <View style={styles.sectionHeader}>
            <Icon name="comment-text" size={24} color={theme.colors.primary} />
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
          />
          <ButtonCustom
            title="Edit Batch"
            onPress={handleEditBatch}
            variant="outline"
            style={styles.actionButton}
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
    padding: 16,
  },
  elevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  batchInfoContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  batchCode: {
    fontSize: 14,
    color: theme.colors.textLight,
    fontFamily: 'monospace',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: 8,
  },
  statsLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: 12,
  },
  timelineContainer: {
    gap: 16,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
  },
  certificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  certificationContent: {
    flex: 1,
  },
  certificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  certificationValue: {
    fontSize: 14,
    color: theme.colors.textLight,
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
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  sustainabilityGrid: {
    gap: 12,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  address: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
    flex: 1,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    padding: 16,
  },
  farmerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  farmerDetails: {
    flex: 1,
  },
  farmerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  farmerContact: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginLeft: 8,
  },
  reviewsContainer: {
    gap: 12,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 12,
  },
});

export default BatchDetailScreen; 
export default BatchDetailScreen; 