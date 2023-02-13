import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import QRCode from "react-qr-code";
import CustomButton from "../../components/CustomButton";
import { useSelector } from "react-redux";
import { encodeLnurl } from "../../utils/bitcoin/lnurl";
import BackButton from "../../components/BackButton";
import Input from "../../components/Input";

const WalletInfoScreen = ({ navigation }) => {
    const username = useSelector((state) => state.auth.username);
    let lnurl = encodeLnurl("https://getcurrent.io/.well-known/lnurlp/egge");
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
                <Input
                    label="Lightning Address"
                    textInputConfig={{ value: username, editable: false }}
                    inputStyle={{ marginBottom: 16 }}
                />
                <Input
                    label="LNURL"
                    textInputConfig={{ value: lnurl, multiline: true, editable: false }}
                    inputStyle={{ marginBottom: 16 }}
                />
                <Text style={globalStyles.textBody}>Static Tip QR Code (LNURL)</Text>
                <View style={styles.qrContainer}>
                    <QRCode value={lnurl} />
                </View>
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
