import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import globalStyles from "../styles/globalStyles";
import CustomButton from "./CustomButton";
import { bolt11Regex } from "../constants/regex";

const QrScanner = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        if (data.match(bolt11Regex)) {
            navigation.navigate("WalletSendScreen", { data: data });
        } else {
            Alert.alert(
                "Not a valid invoice",
                `This is not a valid Lightning Invoice!

(Only bolt11 invoices are supported right now)`,
                [
                    {
                        text: "Okay!",
                        onPress: () => {
                            setScanned(false);
                        },
                    },
                ]
            );
        }
    };

    if (hasPermission === null) {
        return (
            <View style={globalStyles.screenContainer}>
                <Text>Requesting for camera permission...</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={globalStyles.screenContainer}>
                <Text>No permission to access camera...</Text>
            </View>
        );
    }

    return (
        <View
            style={[
                globalStyles.screenContainer,
                { flexDirection: "column-reverse" },
            ]}
        >
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            <CustomButton
                text="Back"
                containerStyles={{ margin: 32 }}
                buttonConfig={{
                    onPress: () => {
                        navigation.goBack();
                    },
                }}
            />
        </View>
    );
};

export default QrScanner;
