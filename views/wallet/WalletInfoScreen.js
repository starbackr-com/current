import { View, Text, StyleSheet } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import QRCode from "react-qr-code";
import CustomButton from "../../components/CustomButton";
import { useSelector } from "react-redux";

const WalletInfoScreen = ({navigation}) => {
    const username = useSelector((state) => state.auth.username)
    console.log(username)
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Your Wallet Info</Text>
            <Text style={globalStyles.textBody}>
                Lightning Address: {username}@starbackr.me
            </Text>
            <Text style={globalStyles.textBody}>
                LNURL: LNURLASDASDSGSDF!123123123123
            </Text>
            <View style={styles.qrContainer}>
                <QRCode
                    value="LNURLASDASDSGSDF!123123123123"
                />
            </View>
            <CustomButton text='Back' buttonConfig={{onPress: () => {navigation.goBack();}}}/>
        </View>
    );
};

export default WalletInfoScreen;

const styles = StyleSheet.create({
    qrContainer: {
        padding: 10,
        backgroundColor: "white",
        borderRadius: 4,
    },
});
