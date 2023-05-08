import { KeyboardAvoidingView, Platform, View } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';
import { CustomButton, Input } from '../../../components';
import { addWalletconnect } from '../walletconnectSlice';
import genWalletConnectKey from '../utils/keys';

const AddWalletconnectView = ({ navigation }) => {
  const [canAdd, setCanAdd] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const { walletBearer } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const changeHandler = (inputAmount) => {
    if (inputAmount.length > 0 && name.length > 0) {
      setCanAdd(true);
    }
    const newAmount = inputAmount.replace(',', '.');
    setAmount(newAmount);
  };

  const addHandler = async () => {
    if (canAdd) {
      const keys = genWalletConnectKey();
      const jsonBody = {
        status: 'active',
        nwcpubkey: keys.pubKey,
        name,
        maxamount: amount,
      };

      const response = await fetch(`${process.env.BASEURL}/v2/walletconnect`, {
        method: 'POST',
        body: JSON.stringify(jsonBody),
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${walletBearer}`,
        },
      });

      const data = await response.json();
      if (data.status === 'success') {
        const newWcData = {
          secret: keys.privKey,
          name,
          maxamount: amount,
          nwcpubkey: keys.pubKey,
          spentamount: 0,
          status: 'active',
          relay: data.relay,
          walletpubkey: data.walletpubkey,
        };
        dispatch(addWalletconnect([newWcData]));
        navigation.navigate('WalletconnectInfoView', { data: newWcData });
      } else {
        alert('Something went wrong...');
      }
    }
  };
  return (
    <KeyboardAvoidingView
      style={[globalStyles.screenContainer]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight + insets.top}
    >
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <View
          style={{
            flex: 5,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: '100%' }}>
            <Input
              textInputConfig={{
                onChangeText: setName,
                placeholder: 'Amethyst App',
              }}
              label="Name"
            />
          </View>
          <View style={{ width: '100%' }}>
            <Input
              textInputConfig={{
                keyboardType: 'numeric',
                onChangeText: changeHandler,
                placeholder: 'in SATS',
              }}
              label="Limit Amount"
            />
          </View>
        </View>
        <View style={{ paddingBottom: 12 }}>
          <CustomButton
            text="Add"
            buttonConfig={{ onPress: addHandler }}
            disabled={!canAdd}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddWalletconnectView;
