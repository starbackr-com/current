import { KeyboardAvoidingView, Platform, View, Text } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';
import { CustomButton, Input } from '../../../components';
import { addWalletconnect } from '../walletconnectSlice';
import genWalletConnectKey from '../utils/keys';
import { publishGenericEventToRelay } from '../../../utils/nostrV2';
import { createKind13194 } from '../../../utils/nostrV2/createEvent';
import MenuBottomSheet from '../../../components/MenuBottomSheet';

const AddWalletconnectView = ({ navigation }) => {
  const [repeat, setRepeat] = useState('Never');
  const [expiry, setExpiry] = useState('0');
  const [error, setError] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const sheetRef = useRef();

  const { walletBearer } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const dismissHandler = useCallback(() => {
    sheetRef.current.dismiss();
  }, [sheetRef]);

  const changeHandler = (e) => {
    if (e.includes(',')) {
      setError('Only numbers allowed...')
    } else {
      setError(false);
      setAmount(e);
    }
  }

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

        //publish an event to the relay using this privateKey
        const event = await createKind13194(keys.privKey);
        console.log('event13194: ', event);
        publishGenericEventToRelay(event, data.relay);

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
        style={{ width: '100%', flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={{ width: '100%', marginBottom: 12 }}>
          <Input
            textInputConfig={{
              onChangeText: setName,
              placeholder: 'Amethyst App',
            }}
            label="Name"
            labelStyle={{ textAlign: 'left' }}
          />
        </View>
        <View style={{ width: '100%', marginBottom: 12 }}>
          <Input
            textInputConfig={{
              keyboardType: 'numeric',
              onChangeText: changeHandler,
              placeholder: 'in SATS',
            }}
            label="Spend Limit"
            labelStyle={{ textAlign: 'left' }}
          />
          {error ? <Text style={globalStyles.textBodyError}>{error}</Text> : undefined}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={[globalStyles.textBody, { marginRight: 12 }]}>
            Reset limit:
          </Text>
          <CustomButton
            text={repeat}
            buttonConfig={{
              onPress: () => {
                sheetRef.current.present();
              },
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 36,
          }}
        >
          <Text style={[globalStyles.textBody, { marginRight: 12 }]}>
            Valid for:
          </Text>
          <View style={{}}>
            <Input
              textInputConfig={{ onChangeText: setExpiry, value: expiry }}
            />
          </View>
          <Text style={[globalStyles.textBody, { marginLeft: 12 }]}>
            Days{' '}
            <Text style={globalStyles.textBodyG}>(0 = does not expire)</Text>
          </Text>
        </View>
        <CustomButton
          text="Add"
          buttonConfig={{ onPress: addHandler }}
          disabled={!name.length > 0 || !amount.length > 0 || error}
          containerStyles={{ marginBottom: 12 }}
        />
      </ScrollView>
      <MenuBottomSheet ref={sheetRef}>
        <CustomButton
          text="Never"
          buttonConfig={{
            onPress: () => {
              setRepeat('Never');
              dismissHandler();
            },
          }}
          containerStyles={{ marginBottom: 6 }}
        />
        <CustomButton
          text="Every Day"
          buttonConfig={{
            onPress: () => {
              setRepeat('Every Day');
              dismissHandler();
            },
          }}
          containerStyles={{ marginBottom: 6 }}
        />
        <CustomButton
          text="Every Week"
          buttonConfig={{
            onPress: () => {
              setRepeat('Every Week');
              dismissHandler();
            },
          }}
          containerStyles={{ marginBottom: 6 }}
        />
        <CustomButton
          text="Every Month"
          buttonConfig={{
            onPress: () => {
              setRepeat('Every Month');
              dismissHandler();
            },
          }}
          containerStyles={{ marginBottom: 6 }}
        />
      </MenuBottomSheet>
    </KeyboardAvoidingView>
  );
};

export default AddWalletconnectView;
