import { View, Text } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';
import { WalletconnectItem } from '../components';
import { globalStyles } from '../../../styles';

const WalletconnectSettingsView = () => {
  const relays = useSelector((state) => state.relays.relays);
  const wcdata = [{name: 'Damus App', maxamount:'100k'}, {name: 'Amethyst App', maxamount:'50k'}]
  console.log(relays);
  return (
    <View style={globalStyles.screenContainer}>
      <Text style={globalStyles.textH2}>Wallet Connect</Text>
      <Text style={globalStyles.textBodyS}>Touch to view QR code or Hold to delete</Text>
      <Animated.FlatList
        data={wcdata}
        renderItem={({ item }) => <WalletconnectItem relay={item} />}
        style={{ width: '100%' }}
        keyExtractor={(item) => item.url}
      />
      <Text style={globalStyles.textBodyS}>
        Wallet Connect (NIP-47) is an easy way to connect this wallet to any supported Nostr clients such as Amethyst.Just copy and paste the QR code.
      </Text>
    </View>
  );
};

export default WalletconnectSettingsView;
