import { View, Text, Alert } from 'react-native';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { CustomButton } from '../../../components';
import invoiceDecoder from 'light-bolt11-decoder';
import { parseInvoice } from '../../../utils/bitcoin/invoice';
import { useAppSelector } from '../../../hooks';
import { useNavigation } from '@react-navigation/native';

type PromptPaymentButtonProps = {
  invoice: string;
  onSubRequired: () => void;
};

const PromptPaymentButton = memo(({ invoice, onSubRequired }: PromptPaymentButtonProps) => {
  const isPremium = useAppSelector((state) => state.auth.isPremium);
  const navigation = useNavigation();

  const amount = useMemo(() => {
    const { amountInSats } = parseInvoice(invoice);
    return amountInSats;
  }, [invoice]);

  const paymentHandler = () => {
    if (!isPremium) {
      onSubRequired();
      return;
    }
    Alert.alert('Pay Agent', `Pay ${amount} SATS to process your request?`, [
      { text: 'Yes', onPress: () => {} },
      { text: 'No', style: 'destructive' },
    ]);
  };

  return (
    <CustomButton
      buttonConfig={{ onPress: paymentHandler }}
      text={`Pay ${amount} SATS to process`}
    />
  );
});

export default PromptPaymentButton;
