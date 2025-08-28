import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import StatsCard from '../component/StatsCard';
import BatchCard from '../component/BatchCard';
import { dashboardApi, UserProfile, DashboardStats, Batch } from '../utils/Api';
import LoadingOverlay from '../component/LoadingOverlay';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  navigation: any;
}

const defaultProfileImage = require('../assets/images/avt.png');

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentBatches, setRecentBatches] = useState<Batch[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const loadDashboardData = async () => {
    try {
      const [profile, stats, batches] = await Promise.all([
        dashboardApi.getUserProfile(),
        dashboardApi.getDashboardStats(),
        dashboardApi.getRecentBatches(),
      ]);

      // Ensure images property exists for each batch
      const batchesWithImages = batches.map((batch: any) => ({
        ...batch,
        images: batch.images || { product: null }
      }));

      setUserProfile(profile);
      setDashboardStats(stats);
      setRecentBatches(batchesWithImages as any);
    } catch (error) {
      console.log('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

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

  if (loading) {
    return <LoadingOverlay visible={true} message="Đang tải bảng điều khiển..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={[theme.colors.primary + '15', theme.colors.white]} 
        style={styles.backgroundContainer}
      ></LinearGradient>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#4CAF50', '#45A049', '#388E3C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}>
            
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={handleViewProfile} style={styles.profileSection}>
                <View style={styles.avatarWrapper}>
                  <Image 
                    source={userProfile?.profile_image ? { uri: userProfile.profile_image } : defaultProfileImage} 
                    style={styles.avatar} 
                  />
                  <View style={styles.statusDot} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.welcomeText}>Chào mừng trở lại,</Text>
                  <Text style={styles.profileName}>{userProfile?.full_name || 'Loading...'}</Text>
                  <View style={styles.locationRow}>
                    <Icon name="map-marker" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.locationText}>{userProfile?.farm_name || 'Loading...'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => navigation.navigate('Notifications')} 
                style={styles.notificationBtn}>
                <Icon name="bell-outline" size={20} color="white" />
                {unreadNotifications > 0 && (
                  <View style={styles.notificationDot}>
                    <Text style={styles.notificationCount}>{unreadNotifications}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity 
                style={[styles.actionCard, styles.primaryAction]} 
                onPress={handleCreateBatch}>
                <View style={styles.actionIconContainer}>
                  <Icon name="plus" size={28} color="white" />
                </View>
                <Text style={styles.actionLabel}>Tạo lô mới</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionCard, styles.secondaryAction]} 
                onPress={handleViewAllBatches}>
                <View style={styles.actionIconContainer}>
                  <Icon name="format-list-bulleted" size={28} color="white" />
                </View>
                <Text style={styles.actionLabel}>Xem tất cả</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionCard, styles.accentAction]} >
                <View style={styles.actionIconContainer}>
                  <Icon name="qrcode" size={28} color="white" />
                </View>
                <Text style={styles.actionLabel}>Mã QR</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Performance Overview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tổng quan hiệu suất</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterText}>Tháng này</Text>
                <Icon name="chevron-down" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.performanceGrid}>
              {dashboardStats && (
                <>
                  <View style={styles.performanceCard}>
                    <View style={styles.performanceHeader}>
                      <View style={[styles.performanceIcon, { backgroundColor: '#E8F5E8' }]}>
                        <Icon name="cube-outline" size={20} color={theme.colors.primary} />
                      </View>
                      <View style={styles.trendBadge}>
                        <Icon name="trending-up" size={12} color="#4CAF50" />
                        <Text style={styles.trendText}>+{dashboardStats.batches.trend.value}%</Text>
                      </View>
                    </View>
                    <Text style={styles.performanceValue}>{dashboardStats.batches.total}</Text>
                    <Text style={styles.performanceLabel}>Tổng số lô</Text>
                    <Text style={styles.performanceSubtext}>Đang được theo dõi</Text>
                  </View>

                  <View style={styles.performanceCard}>
                    <View style={styles.performanceHeader}>
                      <View style={[styles.performanceIcon, { backgroundColor: '#E3F2FD' }]}>
                        <Icon name="qrcode-scan" size={20} color="#2196F3" />
                      </View>
                      <View style={styles.trendBadge}>
                        <Icon name="trending-up" size={12} color="#4CAF50" />
                        <Text style={styles.trendText}>+{dashboardStats.qr_scans.trend.value}%</Text>
                      </View>
                    </View>
                    <Text style={styles.performanceValue}>{dashboardStats.qr_scans.total}</Text>
                    <Text style={styles.performanceLabel}>Lượt quét QR</Text>
                    <Text style={styles.performanceSubtext}>30 ngày qua</Text>
                  </View>

                  <View style={styles.performanceCardFull}>
                    <View style={styles.performanceHeader}>
                      <View style={[styles.performanceIcon, { backgroundColor: '#FFF3E0' }]}>
                        <Icon name="sprout" size={20} color="#FF9800" />
                      </View>
                      <View style={styles.trendBadge}>
                        <Icon name="trending-up" size={12} color="#4CAF50" />
                        <Text style={styles.trendText}>+{dashboardStats.products.trend.value}%</Text>
                      </View>
                    </View>
                    <Text style={styles.performanceValue}>{dashboardStats.products.total}</Text>
                    <Text style={styles.performanceLabel}>Loại sản phẩm</Text>
                    <Text style={styles.performanceSubtext}>Đã đăng ký trong hệ thống</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Recent Batches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Lô gần đây</Text>
              <TouchableOpacity 
                onPress={handleViewAllBatches} 
                style={styles.viewAllBtn}>
                <Text style={styles.viewAllText}>Xem tất cả</Text>
                <Icon name="arrow-right" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            {recentBatches.length > 0 ? (
              <View style={styles.batchesList}>
                {recentBatches.map(batch => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    onPress={() => handleBatchPress(batch.id)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Icon name="package-variant" size={40} color="#E0E0E0" />
                </View>
                <Text style={styles.emptyTitle}>Chưa có lô gần đây</Text>
                <Text style={styles.emptySubtitle}>Tạo lô đầu tiên để bắt đầu theo dõi</Text>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={handleCreateBatch}>
                  <Text style={styles.emptyButtonText}>Tạo lô đầu tiên</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
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
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 25,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '400',
    marginBottom: 2,
  },
  profileName: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
    fontWeight: '500',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 30,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  statsPreview: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    color: 'white',
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 10,
  },
  mainContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 16,
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
  primaryAction: {
    backgroundColor: '#4CAF50',
  },
  secondaryAction: {
    backgroundColor: '#2196F3',
  },
  accentAction: {
    backgroundColor: '#FF9800',
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  performanceGrid: {
    gap: 15,
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flex: 0.48,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  performanceCardFull: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  performanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 2,
  },
  performanceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  performanceSubtext: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  batchesList: {
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 10,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
});

export default DashboardScreen;
