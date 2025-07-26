import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import StatsCard from '../component/StatsCard';
import BatchCard from '../component/BatchCard';

interface DashboardScreenProps {
  navigation: any;
}

const mockUser = {
  full_name: 'John Smith',
  role: 'farmer',
  farm_name: 'Green Farm',
  profile_image: require('../assets/images/avt.png'),
};

const mockStats = [
  {
    title: 'Total Batches',
    subtitle: 'Active batches',
    value: '12',
    icon: 'cube-outline',
    iconColor: theme.colors.primary,
    trend: { value: 25, isPositive: true },
  },
  {
    title: 'QR Scans',
    subtitle: 'Last 30 days',
    value: '48',
    icon: 'qrcode-scan',
    iconColor: theme.colors.secondary,
    trend: { value: 15, isPositive: true },
  },
  {
    title: 'Products',
    subtitle: 'Types registered',
    value: '8',
    icon: 'sprout-outline',
    iconColor: theme.colors.accent,
    trend: { value: 10, isPositive: false },
  },
];

const mockRecentBatches = [
  {
    id: '1',
    product_name: 'Cat Hoa Loc Mangoes',
    category: 'Fruits',
    weight: 20,
    harvest_date: '15/03/2024',
    cultivation_method: 'Organic',
    status: 'active' as const,
    image: 'https://m.media-amazon.com/images/I/8111GVVXLwL.jpg',
  },
  {
    id: '2',
    product_name: 'Beef Tomatoes',
    category: 'Vegetables',
    weight: 15,
    harvest_date: '14/03/2024',
    cultivation_method: 'Traditional',
    status: 'active' as const,
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
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleViewProfile} style={styles.userSection}>
            <Image source={mockUser.profile_image} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{mockUser.full_name}</Text>
              <View style={styles.farmInfo}>
                <Icon name="home-variant" size={16} color={theme.colors.primary} />
                <Text style={styles.farmName}>{mockUser.farm_name}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notificationButton}>
            <Icon name="bell-outline" size={24} color={theme.colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={handleCreateBatch}>
            <Icon name="plus-circle-outline" size={28} color={theme.colors.white} />
            <Text style={styles.actionText}>New Batch</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]} 
            onPress={handleViewAllBatches}>
            <Icon name="format-list-bulleted" size={28} color={theme.colors.white} />
            <Text style={styles.actionText}>View All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.accentButton]} 
            onPress={() => navigation.navigate('QRGenerate', { batchId: '1' })}>
            <Icon name="qrcode" size={28} color={theme.colors.white} />
            <Text style={styles.actionText}>Generate QR</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeaderContainer}>
            <View>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.sectionSubtitle}>Track your performance</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            {mockStats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                subtitle={stat.subtitle}
                value={stat.value}
                icon={stat.icon}
                iconColor={stat.iconColor}
                trend={stat.trend}
                style={styles.statsCard}
              />
            ))}
          </View>
        </View>

        {/* Recent Batches */}
        <View style={styles.recentBatchesSection}>
          <View style={styles.sectionHeaderContainer}>
            <View>
              <Text style={styles.sectionTitle}>Recent Batches</Text>
            </View>
            <TouchableOpacity 
              onPress={handleViewAllBatches} 
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.batchesContainer}>
            {mockRecentBatches.map(batch => (
              <BatchCard
                key={batch.id}
                batch={batch}
                onPress={() => handleBatchPress(batch.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
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
  userInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  userName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 2,
  },
  farmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmName: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
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
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  accentButton: {
    backgroundColor: theme.colors.accent,
  },
  actionText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    marginTop: 8,
  },
  statsSection: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 6,
  },
  periodText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statsCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: theme.colors.background,
  },
  recentBatches: {
    marginBottom: theme.spacing.xl,
  },
  recentBatchesSection: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  batchesContainer: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  viewAllText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginRight: 4,
  },
});

export default DashboardScreen; 