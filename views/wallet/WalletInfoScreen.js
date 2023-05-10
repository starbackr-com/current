import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import QRCode from "react-qr-code";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { encodeLnurl } from "../../utils/bitcoin/lnurl";
import BackButton from "../../components/BackButton";
import * as Clipboard from "expo-clipboard";
import { colors, globalStyles } from "../../styles";


const WalletInfoScreen = ({ navigation }) => {
    const username = useSelector((state) => state.auth.username);
    let lnurl;

    let copyAddress;
    let copyLnurl;


    if (username) {
        const [name, domain] = username.split('@')
        console.log(`https://${domain}/.well-known/lnurlp/${name}`)
        lnurl = encodeLnurl(`https://${domain}/.well-known/lnurlp/${name}`)

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
                  {'Lightning Address: '}
                  {username}<Ionicons name="clipboard" />
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
            <View style={{height:32}}></View>
        </ScrollView>
    );
};

export default WalletInfoScreen;

const styles = StyleSheet.create({
    qrContainer: {
        marginVertical: 16,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 4,
    },
});
