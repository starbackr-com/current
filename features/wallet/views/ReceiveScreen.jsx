import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { globalStyles } from '../../../styles';
import { NumPad } from '../../../components';
import { usePostInvoiceMutation } from '../../../services/walletApi';
import useErrorToast from '../../../hooks/useErrorToast';

const ReceiveScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [postInvoice, { isLoading }] = usePostInvoiceMutation();
  const amountError = useErrorToast('Please enter an amount');
  const genericError = useErrorToast('Something went wrong');

  const confirmHandler = async () => {
    if (amount.length < 1) {
      amountError();
      return;
    }
    try {
      const response = await postInvoice({
        amount,
        description: 'Current Wallet',
      }).unwrap();
      navigation.navigate('WalletInvoiceScreen', {
        invoice: response.payment_request,
      });
    } catch (e) {
      genericError();
      console.log(e);
    }
  };
  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={[globalStyles.textH1, { marginBottom: 0 }]}>
          {amount}
          {amount.length > 0 ? ' SATS' : '-- SATS'}
        </Text>
      </View>
      <View style={{ flex: 2, width: '100%' }}>
        <NumPad
          setValue={setAmount}
          value={amount}
          onConfirm={confirmHandler}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default ReceiveScreen;
