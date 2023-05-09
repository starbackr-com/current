/* eslint-disable react/jsx-one-expression-per-line */
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import QRCode from 'react-qr-code';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import BackButton from '../../../components/BackButton';
import { colors, globalStyles } from '../../../styles';

const styles = StyleSheet.create({
  qrContainer: {
    marginVertical: 16,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 4,
  },
});

const WalletconnectInfoView = ({ route, navigation }) => {
  const { data } = route.params;

  const nwcConnectUrl = `nostr+walletconnect://${data.walletpubkey}?relay=${data.relay}&secret=${data.secret}`;

  const copyUrlHandler = async () => {
    await Clipboard.setStringAsync(nwcConnectUrl);
  };
  const copyPubkeyHandler = async () => {
    await Clipboard.setStringAsync(data.walletpubkey);
  };
  const copyRelayHandler = async () => {
    await Clipboard.setStringAsync(data.relay);
  };
  const copySecretHandler = async () => {
    await Clipboard.setStringAsync(data.secret);
  };
  return (
    <ScrollView style={globalStyles.screenContainerScroll}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: '100%', alignItems: 'flex-start' }}>
          <BackButton
            onPress={() => {
              navigation.navigate('WalletconnectOverview');
            }}
          />
        </View>
        <Text
          style={[
            globalStyles.textBody,
            { color: colors.primary500, marginTop: 16, marginBottom: 16 },
          ]}
          onPress={copyUrlHandler}
        >
          Wallet Connect Config
        </Text>
        <Text style={globalStyles.textBodyS}>
                  Click QR code to copy
        </Text>
        <Text style={globalStyles.textBodyS}>
                  Wallet Connect config.
        </Text>

        {nwcConnectUrl ? (
          <View style={styles.qrContainer}>
            <QRCode size={180} value={nwcConnectUrl} onPress={copyUrlHandler} />
          </View>
        ) : undefined}

        <Text
          style={[
            globalStyles.textBody,
            { color: colors.primary500, marginBottom: 12 },
          ]}
          onPress={copyPubkeyHandler}
        >
          Wallet Connect pubkey: {data.walletpubkey}
          <Ionicons name="clipboard" />
        </Text>
        <Text
          style={[
            globalStyles.textBody,
            { color: colors.primary500, marginBottom: 12 },
          ]}
          onPress={copyRelayHandler}
        >
          Wallet Connect Relay: {data.relay}
          <Ionicons name="clipboard" />
        </Text>
        <Text
          style={[
            globalStyles.textBody,
            { color: colors.primary500, marginBottom: 12 },
          ]}
          onPress={copySecretHandler}
        >
          Wallet Connect Secret: {data.secret}
          <Ionicons name="clipboard" />
        </Text>
      </View>
      <View style={{ height: 32 }}>
        <Text style={globalStyles.textBodyS}>
          NOTE: Anyone can use the secret to drain your wallet.
        </Text>
        <Text style={globalStyles.textBodyS}>DO NOT SHARE this publicly.</Text>
      </View>
    </ScrollView>
  );
};

export default WalletconnectInfoView;
