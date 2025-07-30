/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from './src/theme/colors';
import messaging from '@react-native-firebase/messaging';

// Constants
const FIREBASE_CONFIG = {
  SERVER_KEY: 'AAAAGyacEv4:APA91bH-ihUHU9g8Bt4WF2qS5ctwff1PhHUh-yQZMcQI4Foru3l8Ef98f3JsfiEAWfzIhiBW8-BeWXvIoiLDjaR4Ac6q1une3aaeJ7jsmqGHBOdazBbQD0z6KkKOUEZJ_xrRRTwyXL6I',
  FCM_ENDPOINT: 'https://fcm.googleapis.com/v1/projects/notification-ios-75bda/messages:send',
  TEST_TOKENS: {
    IOS: 'f4_Qvhcr9kTHrGKgRiwOCP:APA91bEtma43k-eWJMMvrlpNDyI1hKkgweUxiOtubRQ3AiQAP-dG4an1BLIr4dmA17Tg_Mjqyyo-FUT1ACYQDzj1ZK7_uYofn3eCZU4MhtygLGeIucUo3bA',
    ANDROID: 'f4_Qvhcr9kTHrGKgRiwOCP:APA91bEtma43k-eWJMMvrlpNDyI1hKkgweUxiOtubRQ3AiQAP-dG4an1BLIr4dmA17Tg_Mjqyyo-FUT1ACYQDzj1ZK7_uYofn3eCZU4MhtygLGeIucUo3bA',
  },
};

// Firebase background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// Notification permission handlers
const NotificationPermission = {
  android: async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Failed to request notification permission:', err);
      return false;
    }
  },

  ios: async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      return enabled;
    } catch (err) {
      console.error('Failed to request notification permission:', err);
      return false;
    }
  },
};

// FCM message sender
const FCMService = {
  sendMessage: async (token: string) => {
    try {
      const message = {
        message: {
          token: token,
          notification: {
            title: 'Hello',
            body: `Send a message from ${Platform.OS === 'ios' ? 'iOS' : 'Android'}`,
          },
          data: {
            title: 'data_title',
            body: 'data_body',
            extra: 'data_extra',
          },
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              notification_priority: 'PRIORITY_HIGH',
              default_sound: true,
              default_vibrate_timings: true,
              default_light_settings: true,
            },
          },
          apns: {
            payload: {
              aps: {
                sound: 'default',
                badge: 1,
                content_available: true,
              },
            },
          },
        },
      };

      console.log('Sending FCM message:', message);

      const response = await fetch(FIREBASE_CONFIG.FCM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${FIREBASE_CONFIG.SERVER_KEY}`,
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      try {
        const result = JSON.parse(responseText);
        console.log('FCM Response:', result);
        return result;
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid JSON response from FCM');
      }
    } catch (error) {
      console.error('Error sending FCM message:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      throw error;
    }
  },
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const initializeMessaging = async () => {
      try {
        // Request permission based on platform
        const permissionGranted = await (Platform.OS === 'ios'
          ? NotificationPermission.ios()
          : NotificationPermission.android());

        if (permissionGranted) {
          const token = await messaging().getToken();
          console.log('FCM Token:', token);
        } else {
          console.log('Notification permission denied');
        }
      } catch (error) {
        console.error('Error initializing messaging:', error);
      }
    };

    initializeMessaging();
  }, []);

  const handleSendMessage = async (platform: 'IOS' | 'ANDROID') => {
    try {
      await FCMService.sendMessage(FIREBASE_CONFIG.TEST_TOKENS[platform]);
    } catch (error) {
      console.error(`Error sending message to ${platform}:`, error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Text
          style={[
            styles.title,
            {color: isDarkMode ? Colors.lighter : Colors.darker},
          ]}>
          Cloud Messaging Test
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Send to iOS"
            onPress={() => handleSendMessage('IOS')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Send to Android"
            onPress={() => handleSendMessage('ANDROID')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    margin: 16,
  },
});

export default App;
