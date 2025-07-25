import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';
import Badge from './Badge';

interface BatchCardProps {
  batch: {
    id: string;
    product_name: string;
    category: string;
    weight: number;
    harvest_date: string;
    cultivation_method: string;
    image?: string;
    status: 'active' | 'expired';
  };
  onPress?: () => void;
  style?: ViewStyle;
}

const BatchCard: React.FC<BatchCardProps> = ({
  batch,
  onPress,
  style,
}) => {
  const getStatusVariant = () => {
    return batch.status === 'active' ? 'success' : 'error';
  };

  const getStatusText = () => {
    return batch.status === 'active' ? 'Active' : 'Expired';
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {batch.image ? (
          <Image
            source={{ uri: batch.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="image" size={32} color={theme.colors.textLight} />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.productName}>{batch.product_name}</Text>
            <Text style={styles.category}>{batch.category}</Text>
          </View>
          <Badge
            text={getStatusText()}
            variant={getStatusVariant()}
            size="small"
          />
        </View>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Icon name="weight" size={16} color={theme.colors.textLight} />
            <Text style={styles.detailText}>{batch.weight} kg</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={16} color={theme.colors.textLight} />
            <Text style={styles.detailText}>{batch.harvest_date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="sprout" size={16} color={theme.colors.textLight} />
            <Text style={styles.detailText}>{batch.cultivation_method}</Text>
          </View>
        </View>
      </View>
      <Icon
        name="chevron-right"
        size={24}
        color={theme.colors.textLight}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  productName: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  category: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs / 2,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: theme.spacing.sm,
  },
});

export default BatchCard; 