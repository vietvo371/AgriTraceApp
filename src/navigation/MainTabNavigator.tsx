import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { COLORS } from '../theme/colors';
import { responsive } from '../theme/responsive';

// Import your screens here
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import SettingsScreen from '../screens/Settings';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray500,
        tabBarStyle: {
          height: responsive.hp('8%'),
          paddingBottom: responsive.hp('1%'),
          paddingTop: responsive.hp('1%'),
        },
        headerStyle: {
          height: responsive.hp('8%'),
        },
        headerTitleStyle: {
          fontSize: responsive.wp('4.5%'),
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          // Add your tab icon here
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          // Add your tab icon here
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          // Add your tab icon here
        }}
      />
    </Tab.Navigator>
  );
}; 