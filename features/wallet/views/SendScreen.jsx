import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { Keyboard } from 'react-native';
import useErrorToast from '../../../hooks/useErrorToast';
import { bolt11Regex, emailRegex } from '../../../constants';
import { globalStyles } from '../../../styles';
import { CustomButton, Input } from '../../../components';

const WalletSendScreen = ({ navigation, route }) => {
  const [inputText, setInputText] = useState('');
  const invoice = route.params?.data;
  const invalidInput = useErrorToast(
    'Invalid Lightning Invoice / Address / LNURL',
  );
  useEffect(() => {
    if (invoice) {
      setInputText(invoice);
    }
  }, []);

  const nextHandler = () => {
    const address = inputText.toLowerCase().match(emailRegex);
    if (
      !inputText.match(bolt11Regex) &&
      !address &&
      !inputText.includes('lnurl')
    ) {
      Keyboard.dismiss();
      invalidInput();
      return;
    } if (address) {
      navigation.navigate('WalletSendLnurlScreen', { address: address[0] });
    } else if (inputText.toLowerCase().includes('lnurl')) {
      navigation.navigate('WalletSendLnurlScreen', {
        lnurl: inputText.toLowerCase(),
      });
    } else {
      navigation.navigate('WalletConfirmScreen', { invoice: inputText });
    }
  };

  return (
    <View style={globalStyles.screenContainer}>
      <Text style={globalStyles.textH1}>Send a payment</Text>
      <Input
        inputStyle={{ width: '80%' }}
        label="Invoice/Address"
        textInputConfig={{
          placeholder: 'Invoice/Address',
          autoCapitalize: false,
          autoCorrect: false,
          value: inputText.toLowerCase(),
          onChangeText: (e) => {
            setInputText(e.toLowerCase());
          },
        }}
      />
      <View style={{ width: '80%' }}>
        <CustomButton
          text="Next"
          containerStyles={{ marginTop: 36 }}
          disabled={inputText.length < 1}
          buttonConfig={{ onPress: nextHandler }}
        />
      </View>
    </View>
  );
};

export default WalletSendScreen;
