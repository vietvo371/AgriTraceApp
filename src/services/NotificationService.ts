import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

class NotificationService {
  async requestUserPermission() {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
             authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    }
    return true;
  }

  async getFCMToken() {
    try {
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    } catch (error) {
      console.log('Error getting FCM token:', error);
      return null;
    }
  }

  setupMessageHandlers() {
    // Xử lý tin nhắn khi app ở background
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Xử lý tin nhắn khi app đang chạy
    messaging().onMessage(async remoteMessage => {
      console.log('Received foreground message:', remoteMessage);
    });

    // Xử lý khi người dùng nhấn vào notification
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
    });

    // Kiểm tra xem app có được mở từ notification không
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
        }
      });
  }
}

export default new NotificationService(); 