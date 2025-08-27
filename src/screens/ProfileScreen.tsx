import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import ImagePicker from '../component/ImagePicker';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';
import { useAuth } from '../contexts/AuthContext';
import Card from '../component/Card';
import LinearGradient from 'react-native-linear-gradient';
// import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import api from '../utils/Api';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'farm' | 'achievements'>('personal');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    profile_image: '',
  });
  
  const [profileData, setProfileData] = useState({
    'id': "",
    'full_name': "",
    'email': "",
    'phone_number': "",
    'address': "",
    'role': "",
    'profile_image': "",
    'stats': {
      'total_batches': "0",
      'active_batches': "0",
      'total_scans': "0",
      'average_rating': "0.0"
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchUser = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfileData(response.data.data);
      setFormData({
        full_name: response.data.data.full_name,
        email: response.data.data.email,
        phone_number: response.data.data.phone_number,
        address: response.data.data.address,
        profile_image: response.data.data.profile_image,
      });
    } catch (error: any) {
      console.error('Error fetching user:', error.response);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      full_name: profileData.full_name,
      email: profileData.email,
      phone_number: profileData.phone_number,
      address: profileData.address,
      profile_image: profileData.profile_image,
    });
    setErrors({});
    setIsEditing(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/user/profile', formData);
      setProfileData(prev => ({
        ...prev,
        ...response.data.data,
        stats: prev.stats,
      }));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      console.log('Profile update error:', error.response);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            signOut();
            navigation.replace('Login');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={[theme.colors.primary + '10', theme.colors.white]} 
        style={styles.backgroundContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Profile Header */}
          <View>
            <Card style={[styles.profileHeader, styles.elevation]}>
              <View style={styles.headerRow}>
                <View style={styles.profileInfo}>
                  <ImagePicker
                    imageUri={profileData.profile_image}
                    onImageSelected={uri =>
                      setFormData(prev => ({ ...prev, profile_image: uri }))
                    }
                    error={errors.profile_image}
                    isCircle
                    size={80}
                    containerStyle={styles.avatarContainer}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{profileData.full_name || 'User Name'}</Text>
                    <View style={styles.userBadgeRow}>
                      <View style={styles.verifiedBadge}>
                        <Icon name="shield-check" size={14} color={theme.colors.success} />
                        <Text style={styles.verifiedText}>Verified User</Text>
                      </View>
                      <View style={styles.gradeBadge}>
                        <Icon name="star" size={14} color={theme.colors.primary} />
                        <Text style={styles.gradeText}>Role: {profileData.role?.charAt(0).toUpperCase() + profileData.role?.slice(1) || 'User'}</Text>
                      </View>
                    </View>
                    <View style={styles.locationRow}>
                      <Icon name="map-marker" size={16} color={theme.colors.textLight} />
                      <Text style={styles.locationText}>{profileData.address || 'Address not specified'}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleEdit}
                >
                  <Icon name="pencil" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Enhanced Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
                    style={styles.statIcon}
                  >
                    <Icon name="package-variant-closed" size={20} color={theme.colors.primary} />
                  </LinearGradient>
                  <Text style={styles.statValue}>{profileData.stats.total_batches}</Text>
                  <Text style={styles.statLabel}>Total Batches</Text>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={[theme.colors.success + '20', theme.colors.success + '10']}
                    style={styles.statIcon}
                  >
                    <Icon name="package-variant" size={20} color={theme.colors.success} />
                  </LinearGradient>
                  <Text style={styles.statValue}>{profileData.stats.active_batches}</Text>
                  <Text style={styles.statLabel}>Active Batches</Text>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={[theme.colors.warning + '20', theme.colors.warning + '10']}
                    style={styles.statIcon}
                  >
                    <Icon name="qrcode-scan" size={20} color={theme.colors.warning} />
                  </LinearGradient>
                  <Text style={styles.statValue}>{profileData.stats.total_scans}</Text>
                  <Text style={styles.statLabel}>Total Scans</Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Enhanced Tabs */}
          <View style={styles.tabsContainer}>
            {[
              { key: 'personal', label: 'Personal' },
              { key: 'farm', label: 'Farm' },
              { key: 'achievements', label: 'Achievements' },
            ].map((tab: any) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === tab.key && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'personal' && (
            <View>
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <Icon name="account-circle" size={24} color={theme.colors.primary} />
                  <Text style={styles.cardTitle}>Personal Information</Text>
                </View>
                
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <Icon name="account" size={18} color={theme.colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Full Name</Text>
                      <Text style={styles.infoValue}>{profileData.full_name || 'Not specified'}</Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <Icon name="phone" size={18} color={theme.colors.info} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Phone</Text>
                      <Text style={styles.infoValue}>{profileData.phone_number || 'Not specified'}</Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <Icon name="email" size={18} color={theme.colors.warning} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Email</Text>
                      <Text style={styles.infoValue}>{profileData.email || 'Not specified'}</Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={styles.infoIconContainer}>
                      <Icon name="map-marker" size={18} color={theme.colors.error} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Address</Text>
                      <Text style={styles.infoValue}>{profileData.address || 'Not specified'}</Text>
                    </View>
                  </View>
                </View>

                {isEditing && (
                  <View style={styles.editActions}>
                    <ButtonCustom
                      title="Save Changes"
                      onPress={handleSave}
                      style={styles.saveButton}
                    />
                    <ButtonCustom
                      title="Cancel"
                      variant="outline"
                      onPress={handleCancel}
                      style={styles.cancelButton}
                    />
                  </View>
                )}
              </Card>
            </View>
          )}

          {activeTab === 'farm' && (
            <View>
              {/* Farm Profile Card */}
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <Icon name="leaf" size={24} color={theme.colors.success} />
                  <Text style={styles.cardTitle}>Farm Profile</Text>
                </View>
                
                <View style={styles.farmStatsGrid}>
                  <View style={styles.farmStatItem}>
                    <Text style={styles.farmStatLabel}>Primary crop</Text>
                    <View style={styles.cropInfo}>
                      <View style={[styles.cropDot, { backgroundColor: theme.colors.success }]} />
                      <Text style={styles.farmStatValue}>Rice</Text>
                    </View>
                  </View>
                  <View style={styles.farmStatItem}>
                    <Text style={styles.farmStatLabel}>Total batches</Text>
                    <Text style={styles.farmStatValue}>{profileData.stats.total_batches}</Text>
                  </View>
                  <View style={styles.farmStatItem}>
                    <Text style={styles.farmStatLabel}>Active batches</Text>
                    <Text style={styles.farmStatValue}>{profileData.stats.active_batches}</Text>
                  </View>
                  <View style={styles.farmStatItem}>
                    <Text style={styles.farmStatLabel}>Total scans</Text>
                    <Text style={styles.farmStatValue}>{profileData.stats.total_scans}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.yieldSection}>
                  <View style={styles.yieldHeader}>
                    <Text style={styles.yieldTitle}>Recent Activity</Text>
                    <View style={styles.yieldBadge}>
                      <Text style={styles.yieldBadgeText}>Last 30 days</Text>
                    </View>
                  </View>
                  
                  {[
                    { label: 'Batches Created', value: profileData.stats.total_batches, isHighlight: true },
                    { label: 'QR Scans', value: profileData.stats.total_scans, isHighlight: false },
                    { label: 'Average Rating', value: profileData.stats.average_rating, isHighlight: false },
                  ].map((item, index) => (
                    <View key={index} style={styles.yieldItem}>
                      <Text style={styles.yieldSeason}>{item.label}</Text>
                      <Text style={[
                        styles.yieldValue, 
                        item.isHighlight && { color: theme.colors.success }
                      ]}>
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          )}

          {activeTab === 'achievements' && (
            <View>
              {/* Achievements Card */}
              <Card style={[styles.contentCard, styles.elevation]}>
                <View style={styles.cardHeader}>
                  <Icon name="trophy" size={24} color={theme.colors.warning} />
                  <Text style={styles.cardTitle}>Achievements & Stats</Text>
                </View>

                <View style={styles.achievementsList}>
                  <View style={styles.achievementItem}>
                    <View style={styles.achievementIcon}>
                      <LinearGradient
                        colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
                        style={styles.achievementIconBg}
                      >
                        <Icon name="package-variant-closed" size={24} color={theme.colors.primary} />
                      </LinearGradient>
                    </View>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementTitle}>Total Batches</Text>
                      <Text style={styles.achievementSubtitle}>Successfully created and managed</Text>
                    </View>
                    <View style={styles.achievementBadge}>
                      <Text style={styles.achievementBadgeText}>{profileData.stats.total_batches}</Text>
                    </View>
                  </View>

                  <View style={styles.achievementItem}>
                    <View style={styles.achievementIcon}>
                      <LinearGradient
                        colors={[theme.colors.success + '20', theme.colors.success + '10']}
                        style={styles.achievementIconBg}
                      >
                        <Icon name="qrcode-scan" size={24} color={theme.colors.success} />
                      </LinearGradient>
                    </View>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementTitle}>QR Scans</Text>
                      <Text style={styles.achievementSubtitle}>Total customer interactions</Text>
                    </View>
                    <View style={[styles.achievementBadge, { backgroundColor: theme.colors.success + '20' }]}>
                      <Text style={[styles.achievementBadgeText, { color: theme.colors.success }]}>
                        {profileData.stats.total_scans}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.achievementItem, styles.ratingItem]}>
                    <View style={styles.achievementIcon}>
                      <LinearGradient
                        colors={[theme.colors.warning + '20', theme.colors.warning + '10']}
                        style={styles.achievementIconBg}
                      >
                        <Icon name="star" size={24} color={theme.colors.warning} />
                      </LinearGradient>
                    </View>
                    <View style={styles.achievementContent}>
                      <Text style={styles.achievementTitle}>Average Rating</Text>
                      <Text style={styles.achievementSubtitle}>Customer satisfaction score</Text>
                    </View>
                    <View style={[styles.achievementBadge, { backgroundColor: theme.colors.warning + '20' }]}>
                      <Text style={[styles.achievementBadgeText, { color: theme.colors.warning }]}>
                        {profileData.stats.average_rating}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          )}

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <ButtonCustom
              title="Logout"
              variant="primary"
              onPress={handleLogout}
              style={styles.logoutButton}
            />
          </View>
        </ScrollView>
      </LinearGradient>
      <LoadingOverlay visible={loading} message="Updating profile..." />
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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
    marginTop: theme.spacing.xxl,
  },
  elevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  // Profile Header Styles
  profileHeader: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userBadgeRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.success,
    fontFamily: theme.typography.fontFamily.medium,
  },
  gradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
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
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
  },

  // Tabs Styles
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: theme.colors.white,
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabText: {
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },

  // Content Card Styles
  contentCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },

  // Info Grid Styles
  infoGrid: {
    gap: theme.spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },

  // Edit Actions
  editActions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  cancelButton: {
    borderColor: theme.colors.border,
  },

  // Farm Stats Styles
  farmStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  farmStatItem: {
    width: '48%',
  },
  farmStatLabel: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: 4,
  },
  farmStatValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  cropDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },

  // Yield Section Styles
  yieldSection: {
    gap: theme.spacing.md,
  },
  yieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  yieldTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  yieldBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yieldBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.medium,
  },
  yieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  yieldSeason: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
  },
  yieldValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },

  // Achievements Styles
  achievementsList: {
    gap: theme.spacing.lg,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
  },
  ratingItem: {
    backgroundColor: theme.colors.background,
  },
  achievementIcon: {},
  achievementIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: 2,
  },
  achievementSubtitle: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.sm,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  achievementBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },

  // Logout Styles
  logoutContainer: {
    marginTop: theme.spacing.xl,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
});

export default ProfileScreen; 