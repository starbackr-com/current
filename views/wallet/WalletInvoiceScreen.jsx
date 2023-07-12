import * as Clipboard from 'expo-clipboard';
import React from 'react';
import Toast from 'react-native-root-toast';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import QRCode from 'react-qr-code';
import CustomButton from '../../components/CustomButton';
import globalStyles from '../../styles/globalStyles';
import { SuccessToast } from '../../components';

const styles = StyleSheet.create({
  qrContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 4,
  },
});

const WalletInvoiceScreen = ({ route, navigation }) => {
  const { invoice } = route.params;

  const copyHandler = async () => {
    await Clipboard.setStringAsync(invoice);
    Toast.show(<SuccessToast text="Copied!" />, {
      duration: Toast.durations.SHORT,
      position: -100,
      backgroundColor: 'green',
    });
  };
  return (
    <View
      style={[
        globalStyles.screenContainer,
        { justifyContent: 'space-between' },
      ]}
    >
      <View>
        <Text style={[globalStyles.textH1, { textAlign: 'center' }]}>
          Your Invoice
        </Text>
        <Pressable style={styles.qrContainer} onPress={copyHandler}>
          <QRCode value={invoice} size={320} />
          <Text
            style={[
              globalStyles.textBody,
              { color: '#18181b', textAlign: 'center' },
            ]}
          >
            Click QR-Code to copy...
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default WalletInvoiceScreen;
