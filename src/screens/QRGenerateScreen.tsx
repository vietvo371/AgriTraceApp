import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Share,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import QRCode from '../component/QRCode';
import Card from '../component/Card';
import ButtonCustom from '../component/ButtonCustom';
import LoadingOverlay from '../component/LoadingOverlay';

interface QRGenerateScreenProps {
  navigation: any;
  route: {
    params: {
      batchId: string;
    };
  };
}

// Mock data - replace with actual API call
const mockBatchData = {
  id: '123',
  product_name: 'Organic Mangoes',
  category: 'Fruits',
  weight: 20,
  variety: 'Alphonso',
  planting_date: '2024-01-15',
  harvest_date: '2024-03-15',
  cultivation_method: 'Organic',
  farmer: {
    name: 'John Doe',
    location: 'Green Valley Farm, California',
  },
};

const QRGenerateScreen: React.FC<QRGenerateScreenProps> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(false);
  const { batchId } = route.params;

  // In a real app, this would be your API endpoint
  const qrValue = `https://agritrace.app/batch/${batchId}`;

  const handleDownload = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual QR code download logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate download
      console.log('QR code downloaded');
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my agricultural product: ${qrValue}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleViewBatch = () => {
    navigation.replace('BatchDetail', { batchId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="QR Code Generated"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Your QR code has been generated successfully!
          </Text>
          <Text style={styles.subtitle}>
            Share this QR code with your customers to let them track the origin of
            your products.
          </Text>

          <View style={styles.qrContainer}>
            <QRCode
              value={qrValue}
              size={250}
              showShare
              showDownload
              onDownload={handleDownload}
            />
          </View>

          <Card variant="outlined" style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Batch Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Product:</Text>
              <Text style={styles.summaryValue}>{mockBatchData.product_name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Category:</Text>
              <Text style={styles.summaryValue}>{mockBatchData.category}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Weight:</Text>
              <Text style={styles.summaryValue}>{mockBatchData.weight} kg</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Harvest Date:</Text>
              <Text style={styles.summaryValue}>{mockBatchData.harvest_date}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Method:</Text>
              <Text style={styles.summaryValue}>
                {mockBatchData.cultivation_method}
              </Text>
            </View>
          </Card>

          <View style={styles.actions}>
            <ButtonCustom
              title="Share QR Code"
              onPress={handleShare}
              variant="outline"
              style={styles.actionButton}
            />
            <ButtonCustom
              title="View Batch Details"
              onPress={handleViewBatch}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
      <LoadingOverlay visible={loading} message="Downloading QR code..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  summaryCard: {
    marginBottom: theme.spacing.xl,
  },
  summaryTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  summaryValue: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
});

export default QRGenerateScreen; 