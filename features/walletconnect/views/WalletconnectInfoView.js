import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import QRCode from "react-qr-code";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { encodeLnurl } from "../../../utils/bitcoin/lnurl";
import BackButton from "../../../components/BackButton";
import * as Clipboard from "expo-clipboard";
import { colors, globalStyles } from "../../../styles";


const WalletconnectInfoView = ({ route, navigation }) => {
    const username = useSelector((state) => state.auth.username);
    let nwcConnectUrl;

    let copyAddress;
    let copyConnectUrl;
    let copyWalletpubkey;
    let copyRelay;
    let copySecret;
    const { data } = route.params;
    console.log(data);

    if (username) {

        nwcConnectUrl = 'nostr+walletconnect://' +
                        data.walletpubkey +
                        '?relay=' + data.relay +
                        '&secret=' + data.secret;


          copyConnectUrl = async () => {
                await Clipboard.setStringAsync(nwcConnectUrl);
            };

            copyWalletpubkey = async () => {
                  await Clipboard.setStringAsync(data.walletpubkey);
              };
            copyRelay = async () => {
                    await Clipboard.setStringAsync(data.relay);
                };
            copySecret = async () => {
                      await Clipboard.setStringAsync(data.secret);
                  };


    }
    return (
        <ScrollView style={globalStyles.screenContainerScroll}>
            <View style={{ alignItems: "center" }}>
                <View style={{ width: "100%", alignItems: "flex-start" }}>
                    <BackButton
                        onPress={() => {
                            navigation.navigate('WalletconnectOverview');
                        }}
                    />
                </View>
                <Text
                    style={[globalStyles.textBody, {color: colors.primary500, marginTop: 16, marginBottom: 16}]}
                    onPress={copyAddress}
                >
                  {'Wallet Connect Address'}

                </Text>
                <Text style={globalStyles.textBodyS}>
                  Click QR code to copy.
                </Text>

                {nwcConnectUrl ? <View style={styles.qrContainer}>
                    <QRCode value={nwcConnectUrl}  onPress={copyConnectUrl} />

                </View> : undefined}

                <Text
                    style={[globalStyles.textBody, {color: colors.primary500, marginBottom: 12}]}
                    onPress={copyWalletpubkey}
                >
                   Wallet Connect pubkey: {data.walletpubkey}<Ionicons name="clipboard" />
                </Text>
                <Text
                    style={[globalStyles.textBody, {color: colors.primary500, marginBottom: 12}]}
                    onPress={copyRelay}
                >
                   Wallet Connect Relay: {data.relay}<Ionicons name="clipboard" />
                </Text>
                <Text
                    style={[globalStyles.textBody, {color: colors.primary500, marginBottom: 12}]}
                    onPress={copySecret}
                >
                   Wallet Connect Secret: {data.secret}<Ionicons name="clipboard" />
                </Text>
            </View>
            <View style={{height:32}}>
            <Text style={globalStyles.textBodyS}>
              NOTE: Anyone can use the secret to drain your wallet.
            </Text>
            <Text style={globalStyles.textBodyS}>
              DO NOT SHARE this publicly.
            </Text>
            </View>
        </ScrollView>
    );
};

export default WalletconnectInfoView;

const styles = StyleSheet.create({
    qrContainer: {
        marginVertical: 16,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 4,
    },
});
