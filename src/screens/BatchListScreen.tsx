import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import BatchCard from '../component/BatchCard';
import SelectCustom from '../component/SelectCustom';
import LoadingOverlay from '../component/LoadingOverlay';

interface BatchListScreenProps {
  navigation: any;
}

type BatchStatus = 'active' | 'expired';

interface Batch {
  id: string;
  product_name: string;
  category: string;
  weight: number;
  harvest_date: string;
  cultivation_method: string;
  image?: string;
  status: BatchStatus;
}

// Mock data - replace with actual API call
const mockBatches: Batch[] = [
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
  {
    id: '3',
    product_name: 'Brown Rice',
    category: 'Grains',
    weight: 50,
    harvest_date: '2024-02-28',
    cultivation_method: 'Organic',
    status: 'expired',
    image: 'https://intechvietnam.com/uploads/noidung/images/baiviet/quy-trinh-san-xuat-gao.jpg',
  },
  {
    id: '4',
    product_name: 'Green Apples',
    category: 'Fruits',
    weight: 25,
    harvest_date: '2024-03-10',
    cultivation_method: 'Traditional',
    status: 'active',
    image: 'https://thefreshandnatural.com/wp-content/uploads/2020/05/APPLE-GREEN.jpg',
  },
];

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Expired', value: 'expired' },
];

const categoryOptions = [
  { label: 'All Categories', value: 'all' },
  { label: 'Fruits', value: 'Fruits' },
  { label: 'Vegetables', value: 'Vegetables' },
  { label: 'Grains', value: 'Grains' },
];

const BatchListScreen: React.FC<BatchListScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredBatches = mockBatches.filter(batch => {
    const matchesSearch = batch.product_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || batch.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || batch.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleBatchPress = (batchId: string) => {
    navigation.navigate('BatchDetail', { batchId });
  };

  const renderHeader = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color={theme.colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search batches..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.textLight}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filterRow}>
        <View style={styles.filterItem}>
          <SelectCustom
            value={statusFilter}
            onChange={setStatusFilter}
            options={filterOptions}
            placeholder="Filter by status"
          />
        </View>
        <View style={styles.filterItem}>
          <SelectCustom
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            placeholder="Filter by category"
          />
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="package-variant"
        size={64}
        color={theme.colors.textLight}
      />
      <Text style={styles.emptyTitle}>No Batches Found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your filters or create a new batch
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Batches"
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={filteredBatches}
        renderItem={({ item }) => (
          <BatchCard
            batch={item}
            onPress={() => handleBatchPress(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
      />
      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  filtersContainer: {
    marginBottom: theme.spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.border + '20',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: -theme.spacing.sm,
  },
  filterItem: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});

export default BatchListScreen; 