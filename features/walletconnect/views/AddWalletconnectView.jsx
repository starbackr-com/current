import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useHeaderHeight } from '@react-navigation/elements';
import { utils } from 'nostr-tools/';
import { globalStyles } from '../../../styles';
import { CustomButton, Input } from '../../../components';
import { pool } from '../../../utils/nostrV2';
import { addWalletconnect } from '../walletconnectSlice';
import { genWalletConnectKey } from '../../../utils';

const AddWalletconnectView = ({ navigation, route }) => {
  const [urlInput, setUrlInput] = useState();
  const [canAdd, setCanAdd] = useState(false);
  const dispatch = useDispatch();
  const { headerHeight } = route.params;
  const localHeaderHeight = useHeaderHeight();

  const initialState = {
    name: '',
    nwcpubkey: '',
    maxamount: 0,
    spentamount: 0,
    secret: '',
    relay: '',
    walletpubkey: '',
    status: ''
  };



  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [wcData, setWCData] = useState(initialState);

  const { walletBearer } = useSelector((state) => state.auth);

  const changeHandler = (amount) => {
      if (amount.length > 0 && name.length > 0) {
          setCanAdd(true);
      }
      const newAmount = amount.replace(",", ".");
      setAmount(newAmount);
  };

  const addHandler = async () => {
    if (canAdd) {

        const keys  = await genWalletConnectKey();

        console.log('nwcpubkey', keys.pubKey);

        let jsonBody = {
              status : 'active',
              nwcpubkey : keys.pubKey,
              name : name,
              maxamount : amount,

        };

        console.log(jsonBody);

        console.log(walletBearer);

        const response = await fetch(`${process.env.BASEURL}/v2/walletconnect`, {
          method: 'POST',
          body: JSON.stringify(jsonBody),
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${walletBearer}`,
          },
        });

        const data = await response.json();

        if (data) {
            data.secret = keys.privKey;
            data.name = name;
            data.maxamount = amount;
            data.nwcpubkey = keys.pubKey;
            data.spentamount = 0;
            data.status = 'active';
            console.log(data);


            dispatch(addWalletconnect([data]));

            navigation.navigate('WalletconnectInfoView', {data: data})  ;
        }









    }
  };
  return (
    <KeyboardAvoidingView
      style={[globalStyles.screenContainer, { paddingTop: 6 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight + localHeaderHeight}
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
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
        }}

        >
        <Input
            textInputConfig={{
                onChangeText: setName,
                placeholder: 'Amethyst App'
            }}
            inputStyle={{ width: "50%", marginBottom: 12 }}
            label="Name"
        />
        <Input
            textInputConfig={{
                autoFocus: true,
                keyboardType: "numeric",
                onChangeText: changeHandler,
                placeholder: 'in SATS'
            }}
            inputStyle={{ width: "50%", marginBottom: 12 }}
            label="Limit Amount"
        />

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
