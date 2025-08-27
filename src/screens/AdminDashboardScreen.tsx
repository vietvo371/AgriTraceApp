import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import StatsCard from '../component/StatsCard';
import UserCard from '../component/UserCard';
import Card from '../component/Card';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';

interface AdminDashboardScreenProps {
  navigation: any;
}

// Mock data - replace with actual API calls
const mockStats = {
  total_users: 156,
  total_batches: 487,
  active_batches: 245,
  total_scans: 1893,
};

const mockRecentUsers = [
  {
    id: '1',
    full_name: 'John Doe',
    email: 'john@example.com',
    role: 'farmer',
    status: 'active',
    total_batches: 12,
  },
  {
    id: '2',
    full_name: 'Green Valley Co-op',
    email: 'info@greenvalley.com',
    role: 'cooperative',
    status: 'active',
    total_batches: 45,
  },
  {
    id: '3',
    full_name: 'Alice Smith',
    email: 'alice@example.com',
    role: 'farmer',
    status: 'pending',
    total_batches: 0,
  },
];

const mockCategories = [
  { id: '1', name: 'Fruits', total_products: 156 },
  { id: '2', name: 'Vegetables', total_products: 234 },
  { id: '3', name: 'Grains', total_products: 97 },
];

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);

  const handleManageUsers = () => {
    // TODO: Navigate to user management screen
    console.log('Navigate to user management');
  };

  const handleManageCategories = () => {
    // TODO: Navigate to category management screen
    console.log('Navigate to category management');
  };

  const handleManagePermissions = () => {
    // TODO: Navigate to permissions management screen
    console.log('Navigate to permissions management');
  };

  const handleEditUser = (userId: string) => {
    // TODO: Implement user edit
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Xóa người dùng',
      'Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác.',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setLoading(true);
            // TODO: Implement actual user deletion
            console.log('Delete user:', userId);
            setTimeout(() => setLoading(false), 1000);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Bảng điều khiển quản trị" showBack={false} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsContainer}>
          <StatsCard
            title="Tổng số người dùng"
            value={mockStats.total_users}
            icon="account-group"
            style={styles.statsCard}
          />
          <StatsCard
            title="Tổng số lô"
            value={mockStats.total_batches}
            icon="package-variant"
            style={styles.statsCard}
          />
          <StatsCard
            title="Lô đang hoạt động"
            value={mockStats.active_batches}
            icon="package-variant-closed-check"
            style={styles.statsCard}
          />
          <StatsCard
            title="Tổng số lượt quét"
            value={mockStats.total_scans}
            icon="qrcode-scan"
            style={styles.statsCard}
          />
        </View>

        <View style={styles.actionsContainer}>
          <ButtonCustom
            title="Quản lý người dùng"
            onPress={handleManageUsers}
            style={styles.actionButton}
          />
          <ButtonCustom
            title="Quản lý danh mục"
            onPress={handleManageCategories}
            variant="outline"
            style={styles.actionButton}
          />
          <ButtonCustom
            title="Quản lý quyền"
            onPress={handleManagePermissions}
            variant="outline"
            style={styles.actionButton}
          />
        </View>

        <Card variant="outlined" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Người dùng gần đây</Text>
            <ButtonCustom
              title="Xem tất cả"
              variant="outline"
              size="small"
              onPress={handleManageUsers}
            />
          </View>
          {mockRecentUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => handleEditUser(user.id)}
              onDelete={() => handleDeleteUser(user.id)}
            />
          ))}
        </Card>

        <Card variant="outlined" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
            <ButtonCustom
              title="Quản lý"
              variant="outline"
              size="small"
              onPress={handleManageCategories}
            />
          </View>
          {mockCategories.map(category => (
            <View key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>
                  {category.total_products} sản phẩm
                </Text>
              </View>
              <Icon
                name="chevron-right"
                size={24}
                color={theme.colors.textLight}
              />
            </View>
          ))}
        </Card>
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
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs / 2,
  },
  categoryCount: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
});

export default AdminDashboardScreen; 