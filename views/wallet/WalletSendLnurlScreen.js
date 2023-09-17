import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import globalStyles from '../../styles/globalStyles';
import { decodeLnurl } from '../../utils/bitcoin/lnurl';
import { NumPad } from '../../components';

const WalletSendLnurlScreen = ({ route, navigation }) => {
  const [minSendable, setMinSendable] = useState();
  const [maxSendable, setMaxSendable] = useState();
  const [callback, setCallback] = useState();
  const [amount, setAmount] = useState('');
  const { address, lnurl } = route.params;

  const fetchFromAddress = async (address) => {
    const [username, url] = address.split('@');
    try {
      const response = await fetch(
        `https://${url}/.well-known/lnurlp/${username}`,
      );
      const { callback, minSendable, maxSendable } = await response.json();
      setMinSendable(minSendable);
      setMaxSendable(maxSendable);
      setCallback(callback);
    } catch (err) {}
  };

  const fetchFromLnurl = async (lnurl) => {
    const url = decodeLnurl(lnurl);
    const response = await fetch(url);
    const { callback, maxSendable, minSendable } = await response.json();
    setMinSendable(minSendable);
    setMaxSendable(maxSendable);
    setCallback(callback);
  };

  const sendHandler = async () => {
    const numAmount = Number(amount);
    if (numAmount > maxSendable / 1000 || numAmount < minSendable / 1000) {
      alert('Selected amount is either too high or too low...');
      return;
    }
    const response = await fetch(`${callback}?amount=${numAmount * 1000}`);
    const data = await response.json();
    const invoice = data.pr;
    navigation.navigate('Wallet', {
      screen: 'WalletConfirmScreen',
      params: { invoice: invoice },
    });
  };

  useEffect(() => {
    if (address) {
      fetchFromAddress(address);
    }
    if (lnurl) {
      console.log(lnurl);
      fetchFromLnurl(lnurl);
    }
  }, []);

  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ alignItems: 'center' }}>
        <Text style={[globalStyles.textH2, { textAlign: 'center' }]}>
          Sending to {address || lnurl}
        </Text>
        {maxSendable ? (
          <View>
            <Text style={globalStyles.textBody}>
              Send an amount between {minSendable / 1000} and{' '}
              {maxSendable / 1000} SATS.
            </Text>
          </View>
        ) : undefined}
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={[globalStyles.textH2, { marginBottom: 0 }]}>
          {amount}
          {amount.length > 0 ? ' SATS' : '-- SATS'}
        </Text>
      </View>
      <View style={{ flex: 2, width: '100%' }}>
        <NumPad value={amount} setValue={setAmount} onConfirm={sendHandler} />
      </View>
    </View>
  );
};

export default WalletSendLnurlScreen;
