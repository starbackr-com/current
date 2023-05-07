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
    let lnurl;

    let copyAddress;
    let copyLnurl;
    const { relay } = route.params;
    console.log(relay);

    if (username) {
        const [name, domain] = username.split('@')
        console.log(`https://${domain}/.well-known/lnurlp/${name}`)
        lnurl = 'nostr+walletconnect://c7063ccd7e9adc0ddd4b77c6bfabffc8399b41e24de3a668a6ab62ede2c8aabd?relay=wss://wc1.current.ninja&pubkey=2d9b9c4fc24cdc1f72ac269bde65b791919728b9f22a5b44d3fae';

          copyAddress = async () => {
                await Clipboard.setStringAsync(username);
            };

          copyLnurl = async () => {
                await Clipboard.setStringAsync(lnurl);
            };


    }
    return (
        <ScrollView style={globalStyles.screenContainerScroll}>
            <View style={{ alignItems: "center" }}>
                <View style={{ width: "100%", alignItems: "flex-start" }}>
                </View>
                <Text
                    style={[globalStyles.textBody, {color: colors.primary500, marginTop: 16, marginBottom: 16}]}
                    onPress={copyAddress}
                >
                  {'Wallet Connect Address'}

                </Text>


                {lnurl ? <View style={styles.qrContainer}>
                    <QRCode value={lnurl}  onPress={copyLnurl} />

                </View> : undefined}
                <Text
                    style={[globalStyles.textBody, {color: colors.primary500, marginBottom: 16}]}
                    onPress={copyLnurl}
                >
                   {lnurl}<Ionicons name="clipboard" />
                </Text>
            </View>
            <View style={{height:32}}>
            <Text style={globalStyles.textBodyS}>
              NOTE: This code contains secret that can be used to drain your wallet. DO NOT SHARE this publicly.
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
