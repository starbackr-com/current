import { View, Text, Alert } from 'react-native';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { CustomButton } from '../../../components';
import invoiceDecoder from 'light-bolt11-decoder';
import { parseInvoice } from '../../../utils/bitcoin/invoice';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useNavigation } from '@react-navigation/native';
import { usePostPaymentMutation } from '../../../services/walletApi';
import { displayModal } from '../../modal/modalSlice';
import { Agent } from '../utils/agents';

type PromptPaymentButtonProps = {
  invoice: string;
  onSubRequired: () => void;
  agent: Agent;
};

const PromptPaymentButton = memo(
  ({ invoice, agent }: PromptPaymentButtonProps) => {
    const isPremium = useAppSelector((state) => state.auth.isPremium);
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const [sendPayment] = usePostPaymentMutation();

    const amount = useMemo(() => {
      const { amountInSats } = parseInvoice(invoice);
      return amountInSats;
    }, [invoice]);

    const paymentHandler = () => {
      if (!isPremium) {
        dispatch(displayModal({ modalKey: 'subscriptionModal' }));
        return;
      }
      dispatch(
        displayModal({
          modalKey: 'paymentModal',
          data: { invoice, receiver: agent.title },
        }),
      );
    };

    return (
      <CustomButton
        buttonConfig={{ onPress: paymentHandler }}
        text={`Pay ${amount} SATS to process`}
      />
    );
  },
);

export default PromptPaymentButton;
