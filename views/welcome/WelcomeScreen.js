import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";
import { generateMnemonic } from "../../utils/keys";
import colors from "../../styles/colors";
import { generateRandomString } from "../../utils/cache/asyncStorage";

const WelcomeScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState();

    const importHandler = async () => {
        generateRandomString(12);
        navigation.navigate("EULA");
    };

    const createHandler = async () => {
        generateRandomString(12);
        setIsLoading(true);
        const mem = await generateMnemonic();
        navigation.navigate("EULA", { mem });
        setIsLoading(false);
        return;
    };

    return (
        <View
            style={[
                globalStyles.screenContainer,
                { justifyContent: "space-around" },
            ]}
        >
            <View style={{ flex: 1, alignItems: "center" }}>
                <Image
                    source={require("../../assets/lightning_logo_negativ.png")}
                    style={{
                        height: 100,
                        width: 100,
                        borderRadius: 10,
                    }}
                />
                <Text style={globalStyles.textH1}>Welcome, stranger!</Text>
                <Text style={globalStyles.textBody}>
                    Do you want to create a new key-pair or import an existing
                    one?
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <CustomButton
                    text="Start fresh"
                    buttonConfig={{ onPress: createHandler }}
                    containerStyles={{
                        margin: 16,
                        minWidth: "80%",
                        justifyContent: "center",
                    }}
                    loading={isLoading}
                />
                <CustomButton
                    text="Import keys/backup"
                    buttonConfig={{ onPress: importHandler }}
                    containerStyles={{
                        margin: 16,
                        minWidth: "80%",
                        justifyContent: "center",
                    }}
                    disabled={isLoading}
                />
            </View>
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
