/* eslint-disable camelcase */
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// eslint-disable-next-line import/no-extraneous-dependencies
import { wordlist } from '@scure/bip39/wordlists/english';
import { useDispatch } from 'react-redux';
import { getPublicKey } from 'nostr-tools';
import { globalStyles } from '../../../styles';
import { CustomButton, Input } from '../../../components';
import { loginToWallet, mnemonicToSeed, saveValue } from '../../../utils';
import { followPubkey } from '../../userSlice';
import { logIn } from '../../authSlice';
import { getOldKind0 } from '../../../utils/nostrV2';

const ImportWordsView = ({ navigation }) => {
  const [input, setInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [invalidWords, setInvalidWords] = useState();
  const [lengthError, setLengthError] = useState(false);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const dispatch = useDispatch();

  useEffect(() => {
    setLengthError(false);
    setInvalidWords();
    const timer = setTimeout(() => {
      if (input.length > 0) {
        const enteredWords = input.trim().toLowerCase().split(' ');
        const invalidEnteredWords = enteredWords.filter(
          (word) => !wordlist.includes(word),
        );
        if (invalidEnteredWords.length > 0) {
          setInvalidWords(invalidEnteredWords);
          console.log(invalidEnteredWords);
          return;
        }
        if (enteredWords.length !== 24 && enteredWords.length !== 12) {
          setLengthError(true);
          console.log('invalid length');
          return;
        }
        setIsValid(true);
      }
    }, 750);
    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  async function submitHandler() {
    const mem = input.trim().toLowerCase().split(' ');
    const sk = mnemonicToSeed(mem);
    const pk = getPublicKey(sk);
    const result = await loginToWallet(sk);
    const { access_token, username } = result?.data || {};
    if (access_token) {
      await saveValue('privKey', sk);
      await saveValue('mem', JSON.stringify(mem));
      dispatch(followPubkey(pk));
      dispatch(logIn({ bearer: access_token, username, pubKey: pk }));
    } else {
      const data = await getOldKind0(pk);
      const events = [];
      data.map((item) => item.map((event) => events.push(event)));
      const mostRecent = events.reduce(
        (p, c) => {
          const r = c.created_at > p.created_at ? c : p;
          return r;
        },
        { created_at: 0 },
      );

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
          console.log(e);
        }
      } else {
        navigation.navigate('Username', {
          sk,
          isImport: true,
        });
      }
    }
  }
  return (
    <KeyboardAvoidingView
      style={[
        globalStyles.screenContainer,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom },
      ]}
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
    >
      <View style={{ flex: 1, width: '100%' }}>
        <Text style={[globalStyles.textBody, { marginBottom: 12 }]}>
          Please import your seed words below
        </Text>
        <Input
          textInputConfig={{
            multiline: true,
            onChangeText: setInput,
            autoComplete: 'off',
            autoCapitalize: 'none',
            autoCorrect: false,
          }}
          inputStyle={{ minHeight: height * 0.2, marginBottom: 12 }}
        />
        {invalidWords ? (
          <Text style={globalStyles.textBodyError}>
            Invalid words:
            {invalidWords.join(' ')}
          </Text>
        ) : undefined}
        {lengthError ? (
          <Text style={globalStyles.textBodyError}>
            Seed phrases must be either 12 or 24 words long
          </Text>
        ) : undefined}
      </View>
      <CustomButton
        text="Next"
        disabled={!isValid}
        buttonConfig={{ onPress: submitHandler }}
      />
    </KeyboardAvoidingView>
  );
};

export default ImportWordsView;
