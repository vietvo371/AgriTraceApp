import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { theme } from '../theme/colors';
import ButtonCustom from '../component/ButtonCustom';
import StatsCard from '../component/StatsCard';
import BatchCard from '../component/BatchCard';

interface DashboardScreenProps {
  navigation: any;
}

const mockUser = {
  full_name: 'John Doe',
  role: 'farmer',
  profile_image: require('../assets/images/avt.png'),
};

const mockStats = [
  {
    title: 'Total Batches',
    value: '12',
    icon: 'package-variant',
    trend: { value: 25, isPositive: true },
  },
  {
    title: 'Recent Scans',
    value: '48',
    icon: 'qrcode-scan',
    trend: { value: 15, isPositive: true },
  },
  {
    title: 'Active Products',
    value: '8',
    icon: 'fruit-cherries',
    trend: { value: 10, isPositive: false },
  },
];

const mockRecentBatches = [
  {
    id: '1',
    product_name: 'Organic Mangoes',
    category: 'Fruits',
    weight: 20,
    harvest_date: '2024-03-15',
    cultivation_method: 'Organic',
    status: 'active',
    image: 'https://m.media-amazon.com/images/I/8111GVVXLwL.jpg',
  },
  {
    id: '2',
    product_name: 'Fresh Tomatoes',
    category: 'Vegetables',
    weight: 15,
    harvest_date: '2024-03-14',
    cultivation_method: 'Traditional',
    status: 'active',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSExFuBL_BshlmedZ2KKvVWofJ2UoOpQMOb7g&s',
  },
];

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const handleCreateBatch = () => {
    navigation.navigate('CreateBatch');
  };

  const handleViewAllBatches = () => {
    navigation.navigate('BatchList');
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile');
  };

  const handleBatchPress = (batchId: string) => {
    navigation.navigate('BatchDetail', { batchId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={mockUser.profile_image}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>{mockUser.full_name}</Text>
            </View>
          </View>
          <ButtonCustom
            title="View Profile"
            variant="outline"
            size="small"
            onPress={handleViewProfile}
          />
        </View>

        <View style={styles.statsContainer}>
          {mockStats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              style={styles.statsCard}
            />
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <ButtonCustom
            title="Create New Batch"
            onPress={handleCreateBatch}
            style={styles.actionButton}
          />
          <ButtonCustom
            title="View All Batches"
            variant="outline"
            onPress={handleViewAllBatches}
            style={styles.actionButton}
          />
        </View>

        <View style={styles.recentBatches}>
          <Text style={styles.sectionTitle}>Recent Batches</Text>
          {mockRecentBatches.map(batch => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onPress={() => handleBatchPress(batch.id)}
            />
          ))}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: theme.spacing.md,
  },
  greeting: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  userName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  statsCard: {
    flex: 1,
    minWidth: '45%',
    marginHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  actionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
  recentBatches: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
});

export default DashboardScreen; 