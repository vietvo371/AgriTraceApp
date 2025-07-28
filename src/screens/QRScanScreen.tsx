import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { theme } from '../theme/colors';
import QRScanner from '../component/QRScanner';
import LoadingOverlay from '../component/LoadingOverlay';

interface QRScanScreenProps {
  navigation: any;
}

const QRScanScreen: React.FC<QRScanScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleScan = async (data: string) => {
    setLoading(true);
    try {
      // Giả sử QR code chứa ID của batch dưới dạng: "batch:123"
      const batchId = data.split(':')[1];
      if (!batchId) {
        Alert.alert('Error', 'Invalid QR code format');
        return;
      }
      
      // Điều hướng đến trang chi tiết batch
      navigation.navigate('BatchDetail', { batchId });
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Error', 'Failed to process QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <QRScanner
        onScan={handleScan}
        onClose={() => navigation.goBack()}
      />
      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
});

export default QRScanScreen; 