import { View, Text } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';
import { WalletconnectItem } from '../components';
import { globalStyles } from '../../../styles';

const WalletconnectSettingsView = () => {
  const wcdata = useSelector((state) => state.walletconnect);
  return (
    <View style={globalStyles.screenContainer}>
      <Text style={globalStyles.textH2}>Wallet Connect</Text>
      {wcdata.wcdata.length > 0 ? (<Text style={globalStyles.textBodyS}>Touch to view QR code or Hold to deactivate</Text>)
      : (<Text style={globalStyles.textBodyS}>Click '+' button to add new wallet connect link</Text>)}
      <Animated.FlatList
        data={wcdata.wcdata}
        renderItem={({ item }) => <WalletconnectItem wcdata={item} />}
        style={{ width: '100%' }}
        keyExtractor={(item) => item.nwcpubkey}
      />
      <Text style={globalStyles.textBodyS}>
        Nostr Wallet Connect (NIP-47) is an easy way to connect this wallet to any supported Nostr clients such as Amethyst.Just copy and paste the QR code.
      </Text>
    </View>
  );
};

export default WalletconnectSettingsView;
