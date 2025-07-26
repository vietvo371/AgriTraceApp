import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { responsive } from '../theme/responsive';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {user && (
        <Text style={styles.userInfo}>
          Welcome, {user.name}!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: responsive.wp('6%'),
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: responsive.hp('2%'),
  },
  userInfo: {
    fontSize: responsive.wp('4%'),
    color: COLORS.textLight,
  },
});

export default ProfileScreen; 