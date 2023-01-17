import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import globalStyles from "../styles/globalStyles";
import CustomButton from "./CustomButton";

const lnRegex = ''
const bcRegex = ''
const lnAddressRegex = ''
const lnurlRegex = ''

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
        if (data.includes('lnbc1')) {
            navigation.navigate("WalletSendScreen", {data: data});
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={[globalStyles.screenContainer, {flexDirection: 'column-reverse'}]}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
                
                <Button
                    title={"Tap to Scan Again"}
                    onPress={() => setScanned(false)}
                />
            )}
            <CustomButton text='Back' containerStyles={{margin: 32}} buttonConfig={{onPress: () => {
                navigation.goBack();
            }}}/>
        </View>
    );
};

export default QrScanner;