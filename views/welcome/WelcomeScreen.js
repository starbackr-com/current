import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch } from "react-redux";
import { usePostNewWalletMutation } from "../../services/walletApi";
import * as secp from "@noble/secp256k1";
import * as nostr from "nostr-tools";
import { saveValue } from "../../utils/secureStore";
import { logIn } from "../../features/authSlice";
import globalStyles from "../../styles/globalStyles";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";
import { generateMnemonic } from "../../utils/keys";

const WelcomeScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState();

    const importHandler = async () => {
        navigation.navigate("ImportKeys");
    };

    const testHandler = async () => {
        navigation.navigate("LoadingProfileScreen");
    };

    const createHandler = async () => {
        setIsLoading(true);
        const mem = await generateMnemonic();
        navigation.navigate("ShowBackupScreen", { mem });
        setIsLoading(false);
        return;
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Welcome stranger!</Text>
            <Text style={globalStyles.textBody}>
                Do you want to create a new key-pair or import an existing one?
            </Text>
            <CustomButton
                text="Start fresh"
                buttonConfig={{ onPress: createHandler }}
                containerStyles={{ margin: 32, minWidth: '80%', justifyContent: 'center' }}
                loading={isLoading}
            />
            <CustomButton
                text="Import keys/backup"
                buttonConfig={{ onPress: importHandler }}
                containerStyles={{ margin: 32, minWidth: '80%', justifyContent: 'center' }}
                disabled={isLoading}
            />
            <CustomButton
                text="Testing"
                buttonConfig={{ onPress: testHandler }}
            />
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#18181b",
        alignItems: "center",
        textAlign: "center",
    },

    createKeyText: {
        color: "white",
        textAlign: "center",
        margin: 12,
        fontFamily: "Montserrat-Regular",
        fontWeight: "400",
    },
});
