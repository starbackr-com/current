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

const WelcomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const importHandler = async () => {
        navigation.navigate("ImportKeys");
    };

    const testHandler = async () => {
        navigation.navigate("CreateProfileScreen", {username:'EggeTesting'});
    };

    const createHandler = () => {
        navigation.navigate("CreateKeys");
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Welcome stranger!</Text>
            <Text style={globalStyles.textBody}>
                Create a new key-pair or import one to get started.
            </Text>
            <CustomButton
                text="Create new keys"
                buttonConfig={{ onPress: createHandler }}
                containerStyles={{margin: 32}}
            />
            <CustomButton
                text="Import keys"
                buttonConfig={{ onPress: importHandler }}
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
