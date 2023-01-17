import { View, Text } from "react-native";
import { decode } from "light-bolt11-decoder";
import CustomButton from "../../components/CustomButton";
import { usePostPaymentMutation } from "../../services/walletApi";
import globalStyles from "../../styles/globalStyles";


const WalletConfirmScreen = ({ route, navigation }) => {
    const invoice = route.params?.invoice;
    if (!invoice) {
        alert("Something went wrong");
        navigation.goBack();
    }

    const decodedInvoice = decode(invoice).sections;
    const invoiceAmount = decodedInvoice.find(
        (section) => section.name === "amount"
    ).value;
    const memo = decodedInvoice.find(
        (section) => section.name === "description"
    ).value;

    const [sendPayment] = usePostPaymentMutation();
    return (
        <View style={globalStyles.screenContainer}>
            <View style={{ flex: 3 }}>
                <Text style={globalStyles.textH1}>Confirm Payment</Text>
                <Text style={globalStyles.textBody}>
                    Amount: {invoiceAmount / 1000} SATS
                </Text>
                <Text style={globalStyles.textBody}>Memo: {memo}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <CustomButton
                    text="Send Payment!"
                    buttonConfig={{
                        onPress: async () => {
                            const result = await sendPayment({ invoice });
                            alert(result.data?.message);
                        },
                    }}
                />
                <CustomButton
                    text="Back to Wallet"
                    buttonConfig={{
                        onPress: async () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'WalletHomeScreen' }],
                              });
                        },
                    }}
                />
            </View>
        </View>
    );
};

export default WalletConfirmScreen