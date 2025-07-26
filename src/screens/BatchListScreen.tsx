import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
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
    product_name: 'Cat Hoa Loc Mangoes',
    category: 'Fruits',
    weight: 20,
    harvest_date: '15/03/2024',
    cultivation_method: 'Organic',
    status: 'active',
    image: 'https://m.media-amazon.com/images/I/8111GVVXLwL.jpg',
  },
  {
    id: '2',
    product_name: 'Beef Tomatoes',
    category: 'Vegetables',
    weight: 15,
    harvest_date: '14/03/2024',
    cultivation_method: 'Traditional',
    status: 'active',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSExFuBL_BshlmedZ2KKvVWofJ2UoOpQMOb7g&s',
  },
  {
    id: '3',
    product_name: 'Brown Rice',
    category: 'Grains',
    weight: 50,
    harvest_date: '28/02/2024',
    cultivation_method: 'Organic',
    status: 'expired',
    image: 'https://intechvietnam.com/uploads/noidung/images/baiviet/quy-trinh-san-xuat-gao.jpg',
  },
  {
    id: '4',
    product_name: 'Green Apples',
    category: 'Fruits',
    weight: 25,
    harvest_date: '10/03/2024',
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
        <Icon name="magnify" size={24} color={theme.colors.primary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by product name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.textLight}
        />
        {searchQuery ? (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Icon name="close-circle" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filterRow}>
        <View style={styles.filterItem}>
          <SelectCustom
            value={statusFilter}
            onChange={setStatusFilter}
            options={filterOptions}
            placeholder="Status"
            containerStyle={styles.selectContainer}
          />
        </View>
        <View style={styles.filterItem}>
          <SelectCustom
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            placeholder="Category"
            containerStyle={styles.selectContainer}
          />
        </View>
      </View>

      
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon
          name="package-variant"
          size={48}
          color={theme.colors.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>No Batches Found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your filters or create a new batch
      </Text>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateBatch')}
      >
        <Icon name="plus" size={20} color={theme.colors.white} />
        <Text style={styles.createButtonText}>Create New Batch</Text>
      </TouchableOpacity>
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
        showsVerticalScrollIndicator={false}
      />
      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: theme.spacing.lg,
    gap: 12,
  },
  filtersContainer: {
    // marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
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
  searchInput: {
    flex: 1,
    height: 50,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  clearButton: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    // marginBottom: theme.spacing.md,
  },
  filterItem: {
    flex: 1,
  },
  selectContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
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
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resultsText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 4,
  },
  sortText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
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
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: 8,
  },
  createButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
  },
});

export default BatchListScreen; 