import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.productName}>{mockBatchData.product_name}</Text>
            <Text style={styles.category}>{mockBatchData.category}</Text>
          </View>
          <Badge
            text={mockBatchData.status.toUpperCase()}
            variant={mockBatchData.status === 'active' ? 'success' : 'error'}
          />
        </View>

        <Card variant="outlined" style={styles.section}>
          <Text style={styles.sectionTitle}>Product Information</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="weight" size={20} color={theme.colors.textLight} />
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{mockBatchData.weight} kg</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="sprout" size={20} color={theme.colors.textLight} />
              <Text style={styles.infoLabel}>Method</Text>
              <Text style={styles.infoValue}>
                {mockBatchData.cultivation_method}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="calendar" size={20} color={theme.colors.textLight} />
              <Text style={styles.infoLabel}>Planted</Text>
              <Text style={styles.infoValue}>{mockBatchData.planting_date}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon
                name="calendar-check"
                size={20}
                color={theme.colors.textLight}
              />
              <Text style={styles.infoLabel}>Harvested</Text>
              <Text style={styles.infoValue}>{mockBatchData.harvest_date}</Text>
            </View>
          </View>
        </Card>

        <Card variant="outlined" style={styles.section}>
          <Text style={styles.sectionTitle}>Farm Location</Text>
          <Text style={styles.address}>{mockBatchData.location.address}</Text>
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
        </Card>

        <Card variant="outlined" style={styles.section}>
          <Text style={styles.sectionTitle}>Farmer Information</Text>
          <View style={styles.farmerInfo}>
            <Image
              source={{ uri: mockBatchData.images.farmer }}
              style={styles.farmerImage}
            />
            <View style={styles.farmerDetails}>
              <Text style={styles.farmerName}>{mockBatchData.farmer.name}</Text>
              <Text style={styles.farmerContact}>
                {mockBatchData.farmer.phone}
              </Text>
              <Text style={styles.farmerContact}>
                {mockBatchData.farmer.email}
              </Text>
            </View>
          </View>
        </Card>

        <Card variant="outlined" style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon
                name="qrcode-scan"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.statValue}>
                {mockBatchData.stats.total_scans}
              </Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statItem}>
              <Icon
                name="account-group"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.statValue}>
                {mockBatchData.stats.unique_customers}
              </Text>
              <Text style={styles.statLabel}>Customers</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="star" size={24} color={theme.colors.warning} />
              <Text style={styles.statValue}>
                {mockBatchData.stats.average_rating}
              </Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
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
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  productName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  category: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs / 2,
  },
  infoValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  address: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
  },
  farmerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  farmerContact: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs / 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginVertical: theme.spacing.xs,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
});

export default BatchDetailScreen; 