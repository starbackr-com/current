import { Text, View } from 'react-native';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { colors, globalStyles } from '../../../styles';
import { useAppSelector } from '../../../hooks';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useDispatch } from 'react-redux';
import { dismissModal } from '../modalSlice';
import { parseInvoice } from '../../../utils/bitcoin/invoice';
import { CustomButton, SwipeToConfirm } from '../../../components';
import { usePostPaymentMutation } from '../../../services/walletApi';

const PaymentConfirmationModal = memo(() => {
  const { mounted, data } = useAppSelector((state) => state.modal.paymentModal);

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const [sendPayment] = usePostPaymentMutation();

  const modalRef = useRef<BottomSheetModalMethods>();

  const amount = useMemo(() => {
    if (data?.invoice) {
      const { amountInSats } = parseInvoice(data.invoice);
      return amountInSats;
    }
  }, [data]);

  const paymentHandler = async () => {
    setSending(true);
    try {
      const res = await sendPayment({ invoice: data.invoice, amount }).unwrap();
      if (res.error === false) {
        setSuccess(true);
        setTimeout(() => {
          modalRef.current.dismiss();
        }, 2000);
      }
    } catch (e) {
      if (e?.data?.error && e?.data?.message) {
        setError(e.data.message);
      }
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      modalRef.current.present();
    } else {
      modalRef.current.dismiss();
    }
  }, [mounted, modalRef]);

  const renderBackground = (props) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing={true}
      backgroundStyle={{ backgroundColor: colors.backgroundPrimary }}
      backdropComponent={renderBackground}
      handleIndicatorStyle={{ backgroundColor: colors.backgroundSecondary }}
      onDismiss={() => {
        setSending(false);
        setSuccess(false);
        setError('');
        dispatch(dismissModal({ modalKey: 'paymentModal' }));
      }}
    >
      <BottomSheetView>
        {mounted && data ? (
          <View style={{ alignItems: 'center', padding: 24 }}>
            <Text style={globalStyles.textH2}>
              Send {amount} SATS to {data.receiver}?
            </Text>
            {error ? (
              <Text style={globalStyles.textBodyError}>{error}</Text>
            ) : undefined}
            {/* {!success ? (
              <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                <CustomButton
                  text="Confirm"
                  containerStyles={{
                    flex: 1,
                    borderColor: colors.primary500,
                    borderWidth: 1,
                  }}
                  buttonConfig={{
                    onPress: paymentHandler,
                  }}
                  loading={sending}
                />

                <CustomButton
                  text="Cancel"
                  containerStyles={{ borderColor: 'darkred', borderWidth: 1 }}
                  buttonConfig={{
                    onPress: () => {
                      dispatch(dismissModal({ modalKey: 'paymentModal' }));
                    },
                  }}
                />
              </View>
            ) : (
              <Text style={globalStyles.textH2}>
                Transaction{' '}
                <Text style={{ color: 'lightgreen' }}>successful!</Text>
              </Text>
            )} */}
            {!success ? (
              !error ? (
                <SwipeToConfirm onConfirm={paymentHandler} loading={sending} />
              ) : undefined
            ) : (
              <Text style={globalStyles.textH2}>
                Transaction{' '}
                <Text style={{ color: 'lightgreen' }}>successful!</Text>
              </Text>
            )}
          </View>
        ) : undefined}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default PaymentConfirmationModal;
