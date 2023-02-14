import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import QRCode from "react-qr-code";
import CustomButton from "../../components/CustomButton";
import { useSelector } from "react-redux";
import { encodeLnurl } from "../../utils/bitcoin/lnurl";
import BackButton from "../../components/BackButton";
import Input from "../../components/Input";
import * as Clipboard from "expo-clipboard";


const WalletInfoScreen = ({ navigation }) => {
    const username = useSelector((state) => state.auth.username);
    console.log(username)
    let lnurl;

    let copyAddress;
    let copyLnurl;


    if (username) {
        const [name, domain] = username.split('@')
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
                    <BackButton
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                </View>
                <Text
                    style={[globalStyles.textBody, {color: colors.primary500, marginTop: 30, marginBottom: 30}]}
                    onPress={copyAddress}
                >
                  {'Lightning Address: '}
                  {username}
                </Text>


                {lnurl ? <View style={styles.qrContainer}>
                    <Text style={globalStyles.textBody}>Static Tip QR Code (LNURL)</Text>
                    <QRCode value={lnurl}  onPress={copyLnurl} />

                </View> : undefined}
                <Text
                    style={[globalStyles.textBody, {color: colors.primary500, marginBottom: 30}]}
                    onPress={copyLnurl}
                >
                   {lnurl}
                </Text>
                    <Text style={globalStyles.textBody}>Touch to copy</Text>
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
