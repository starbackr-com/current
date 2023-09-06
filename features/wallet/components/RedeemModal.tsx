import { View, Text, KeyboardAvoidingView } from 'react-native';
import React, { forwardRef, useState } from 'react';
import MenuBottomSheet from '../../../components/MenuBottomSheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { CustomButton, CustomKeyboardView, Input } from '../../../components';
import { colors, globalStyles } from '../../../styles';
import { CashuMint, CashuWallet, getDecodedToken } from '@cashu/cashu-ts';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { usePostInvoiceMutation } from '../../../services/walletApi';

const RedeemModal = forwardRef(
  (props, ref: React.Ref<BottomSheetModalMethods>) => {
    const [input, setInput] = useState<string>('');
    const [addedAmount, setAddedAmount] = useState<number | undefined>();
    const [getInvoice] = usePostInvoiceMutation();
    const redeemHandler = () => {
      console.log('works');
      if (input.length < 1) {
        return;
      }
      const { token } = getDecodedToken(input);
      console.log(token);
      token.forEach(async (singleToken) => {
        const { mint, proofs } = singleToken;
        const amount = proofs.reduce((p, c) => p + c.amount, 0);
        const feeReserve = Math.max(10, Math.floor(amount / 500));
        console.log(feeReserve);
        try {
          const invoice = await getInvoice({
            amount: amount - feeReserve,
            description: 'Cashu Redeem',
          }).unwrap();
          console.log(invoice);
          const wallet = new CashuWallet(new CashuMint(mint));
          const fee = await wallet.getFee(invoice.payment_request);
          console.log('fees', fee);
          try {
            const response = await wallet.payLnInvoice(
              invoice.payment_request,
              proofs,
              feeReserve,
            );
            if (response.isPaid === true) {
              setAddedAmount(amount - feeReserve);
              setTimeout(() => {ref.current.dismiss()}, 2000);
            }
          } catch (e) {
            console.log(JSON.stringify(e));
          }
          console.log('runs');
        } catch (e) {
          console.log(e);
        }
      });
    };
    return (
      <MenuBottomSheet ref={ref}>
        <View style={{ gap: 12 }}>
          <Text style={globalStyles.textBodyBold}>Redeem Cashu or LNURL</Text>
          <Text style={globalStyles.textBody}>Coming soon!</Text>
          {/* {!addedAmount ? (
            <View style={{ gap: 12 }}>
              <BottomSheetTextInput
                style={{
                  width: '100%',
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.primary500,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 8,
                  color: 'white',
                }}
                onChangeText={setInput}
              />
              <CustomButton
                text="Confirm"
                buttonConfig={{ onPress: redeemHandler }}
              />
            </View>
          ) : (
            <Text style={globalStyles.textBodyBold}>Successfully redeemed {addedAmount} SATS.</Text>
          )} */}
        </View>
      </MenuBottomSheet>
    );
  },
);

export default RedeemModal;
