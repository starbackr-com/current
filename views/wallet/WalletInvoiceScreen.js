import { View, Text, StyleSheet, Pressable } from "react-native";
import QRCode from "react-qr-code";
import CustomButton from "../../components/CustomButton";
import globalStyles from "../../styles/globalStyles";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";

const WalletInvoiceScreen = ({ route, navigation }) => {
    const invoice = route.params.invoice;
    const [copied, setCopied] = useState(false);

    const copyHandler = async () => {
        await Clipboard.setStringAsync(invoice);
        setCopied(true);
    };
    return (
        <View
            style={[
                globalStyles.screenContainer,
                { justifyContent: "space-between" },
            ]}
        >
            <View>
                <Text style={[globalStyles.textH1, { textAlign: "center" }]}>
                    Your Invoice
                </Text>
                <Pressable style={styles.qrContainer} onPress={copyHandler}>
                    <QRCode value={invoice} size={320} />
                    <Text
                        style={[
                            globalStyles.textBody,
                            { color: "#18181b", textAlign: "left" },
                            copied ? { color: "green" } : undefined,
                        ]}
                    >
                        Click QR-Code to copy...
                    </Text>
                </Pressable>
            </View>
            <CustomButton
                text="Go Back"
                buttonConfig={{
                    onPress: () => {
                        navigation.navigate("WalletHomeScreen");
                    },
                }}
            />
        </View>
    );
};

export default WalletInvoiceScreen;

const styles = StyleSheet.create({
    qrContainer: {
        padding: 10,
        backgroundColor: "white",
        borderRadius: 4,
    },
});
