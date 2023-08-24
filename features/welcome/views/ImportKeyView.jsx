/* eslint-disable camelcase */
import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { getPublicKey } from 'nostr-tools';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { followPubkey } from '../../userSlice';
import { logIn } from '../../authSlice';
import { decodePubkey, loginToWallet, saveValue } from '../../../utils';
import { getContactAndRelayList, getOldKind0Pool, updateFollowedUsers } from '../../../utils/nostrV2';
import { globalStyles } from '../../../styles';
import { CustomButton, Input } from '../../../components';
import { bech32Sk, hexRegex } from '../../../constants';
import devLog from '../../../utils/internal';
import { setupRelay } from '../../relays/relaysSlice';
import useSilentFollow from '../../../hooks/useSilentFollow';

const ImportKeyView = ({ navigation }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();
  const silentFollow = useSilentFollow();


  const { t } = useTranslation(['welcome', 'common']);

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
        try {
          const contactList = await getContactAndRelayList(pk);
          if (contactList.content.length > 0) {
            const relayMetadata = JSON.parse(contactList.content);
            const relays = Object.keys(relayMetadata).map((relay) => ({
              url: relay,
              read: relayMetadata[relay].read,
              write: relayMetadata[relay].write,
            }));
            dispatch(setupRelay(relays));
          }
          if (contactList.tags.length > 0) {
            const pubkeys = contactList.tags.map((tag) => tag[1]);
            silentFollow(pubkeys);
          }
        } catch (e) {
          devLog(e);
        }
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
              t('ImportKeyView_H2_Deleted'),
              t('ImportKeyView_Body_Deleted'),
              [
                {
                  text: t('ImportKeyView_Button_Deleted'),
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
            {t('ImportKeyView_Error_Key')}
          </Text>
        ) : undefined}
      </View>
      <View>
        <CustomButton
          buttonConfig={{ onPress: submitHandler }}
          text={t('ImportKeyView_Button_Import')}
          containerStyles={{ marginBottom: 16 }}
        />
        <CustomButton
          buttonConfig={{
            onPress: () => {
              navigation.goBack();
            },
          }}
          text={t('Common_GoBack')}
          secondary
          containerStyles={{ marginBottom: 16 }}
        />
      </View>
    </View>
  );
};

export default ImportKeyView;
