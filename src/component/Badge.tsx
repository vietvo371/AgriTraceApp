import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../theme/colors';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'default';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return theme.colors.success + '20';
      case 'error':
        return theme.colors.error + '20';
      case 'warning':
        return theme.colors.warning + '20';
      case 'info':
        return theme.colors.info + '20';
      default:
        return theme.colors.border + '40';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.text;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        getSizeStyle(),
        { backgroundColor: getBackgroundColor() },
        style,
      ]}>
      <Text
        style={[
          styles.text,
          getTextSizeStyle(),
          { color: getTextColor() },
          textStyle,
        ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  small: {
    paddingVertical: theme.spacing.xs / 2,
    paddingHorizontal: theme.spacing.xs,
  },
  medium: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  large: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  text: {
    fontFamily: theme.typography.fontFamily.medium,
  },
  smallText: {
    fontSize: theme.typography.fontSize.xs,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.sm,
  },
  largeText: {
    fontSize: theme.typography.fontSize.md,
  },
});

export default Badge; 