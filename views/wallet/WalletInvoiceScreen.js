import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-qr-code";
import CustomButton from "../../components/CustomButton";
import globalStyles from "../../styles/globalStyles";


const WalletInvoiceScreen = ({ route, navigation }) => {
    const invoice = route.params.invoice;
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Your Invoice</Text>
            <View style={styles.qrContainer}>
                <QRCode value={invoice} size={320} />
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

export default WalletInvoiceScreen

const styles = StyleSheet.create({
    qrContainer: {
        padding: 10,
        backgroundColor: "white",
        borderRadius: 4,
    },
});