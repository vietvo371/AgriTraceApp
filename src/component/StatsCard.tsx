import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/colors';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
  style?: ViewStyle;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconColor = theme.colors.primary,
  trend,
  onPress,
  style,
}) => {
  const renderTrend = () => {
    if (!trend) return null;

    const trendIcon = trend.isPositive ? 'trending-up' : 'trending-down';
    const trendColor = trend.isPositive ? theme.colors.success : theme.colors.error;
    const trendValue = trend.isPositive ? `+${trend.value}%` : `${trend.value}%`;

    return (
      <View style={styles.trendContainer}>
        <Icon name={trendIcon} size={16} color={trendColor} />
        <Text style={[styles.trendText, { color: trendColor }]}>
          {trendValue}
        </Text>
      </View>
    );
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Icon name={icon} size={24} color={iconColor} />
        </View>
        {renderTrend()}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    marginLeft: theme.spacing.xs,
  },
});

export default StatsCard; 