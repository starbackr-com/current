/* eslint-disable camelcase */
import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { getPublicKey } from 'nostr-tools';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { followPubkey } from '../../userSlice';
import { logIn } from '../../authSlice';
import { decodePubkey, loginToWallet, saveValue } from '../../../utils';
import { getOldKind0Pool } from '../../../utils/nostrV2';
import { globalStyles } from '../../../styles';
import { CustomButton, Input } from '../../../components';
import { bech32Sk, hexRegex } from '../../../constants';
import devLog from '../../../utils/internal';

const ImportKeyView = ({ navigation }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();

  const submitHandler = async () => {
    let sk;
    if (!key.match(hexRegex) && !key.match(bech32Sk)) {
      setError(true);
      return;
    }
    if (key.match(hexRegex)) {
      sk = key;
    }
    if (key.match(bech32Sk)) {
      sk = decodePubkey(key);
    }
    try {
      const result = await loginToWallet(sk);
      const pk = getPublicKey(sk);
      if (result?.data?.access_token) {
        await saveValue('privKey', sk);
        const { access_token, username } = result.data;
        dispatch(followPubkey(pk));
        dispatch(logIn({ bearer: access_token, pubKey: pk, username }));
        return;
      }
      const mostRecent = await getOldKind0Pool();
      if (mostRecent && mostRecent.content) {
        try {
          const { deleted } = JSON.parse(mostRecent.content);
          if (deleted) {
            Alert.alert(
              'Deleted Account?',
              'You cannot use deleted account. Please use a different key.',
              [
                {
                  text: 'OK',
                },
              ],
            );
          } else {
            navigation.navigate('Username', {
              sk,
              isImport: true,
            });
          }
        } catch (e) {
          devLog(e);
        }
      } else {
        navigation.navigate('Username', {
          sk,
          isImport: true,
        });
      }
    } catch (e) {
      devLog(e);
    }
  };

  const changeHandler = (e) => {
    setError(false);
    setKey(e);
  };
  return (
    <View
      style={[
        globalStyles.screenContainer,
        { paddingTop: inset.top + 12, paddingBottom: inset.bottom },
      ]}
    >
      <Text style={globalStyles.textBody}>Import a key</Text>
      <View style={{ width: '80%', flex: 2 }}>
        <Input
          label="Private Key"
          textInputConfig={{
            placeholder: 'nsec1...',
            onChangeText: changeHandler,
          }}
        />
        {error ? (
          <Text style={[globalStyles.textBodyS, { color: 'red' }]}>
            Invalid private key! Only HEX (f57d...) or bech32 (nsec1...) keys
            are supported
          </Text>
        ) : undefined}
      </View>
      <View>
        <CustomButton
          buttonConfig={{ onPress: submitHandler }}
          text="Import"
          containerStyles={{ marginBottom: 16 }}
        />
        <CustomButton
          buttonConfig={{
            onPress: () => {
              navigation.goBack();
            },
          }}
          text="Go Back"
          secondary
          containerStyles={{ marginBottom: 16 }}
        />
      </View>
    </View>
  );
};

export default ImportKeyView;
