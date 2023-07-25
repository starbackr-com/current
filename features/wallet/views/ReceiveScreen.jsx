/* eslint-disable react/no-unstable-nested-components */
import { View, Text } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { colors, globalStyles } from '../../../styles';
import { NumPad } from '../../../components';
import { usePostInvoiceMutation } from '../../../services/walletApi';
import useErrorToast from '../../../hooks/useErrorToast';
import BackHeaderWithButton from '../../../components/BackHeaderWithButton';
import RedeemModal from '../components/RedeemModal';

const ReceiveScreen = ({ navigation, route }) => {
  const [amount, setAmount] = useState('');
  const [postInvoice, { isLoading }] = usePostInvoiceMutation();
  const amountError = useErrorToast('Please enter an amount');
  const genericError = useErrorToast('Something went wrong');
  const modalRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeaderWithButton
          navigation={navigation}
          rightButton={() => (
            <Text
              style={[globalStyles.textBody, { color: colors.primary500 }]}
              onPress={() => {
                modalRef.current.present();
              }}
            >
              Redeem
            </Text>
          )}
        />
      ),
    });
  }, [modalRef]);

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
      <RedeemModal ref={modalRef} />
    </View>
  );
};

export default ReceiveScreen;
