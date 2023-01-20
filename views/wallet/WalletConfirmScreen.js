import { View, Text } from "react-native";
import { decode } from "light-bolt11-decoder";
import CustomButton from "../../components/CustomButton";
import { usePostPaymentMutation } from "../../services/walletApi";
import globalStyles from "../../styles/globalStyles";
import { useState } from "react";


const WalletConfirmScreen = ({ route, navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const {invoice} = route.params;
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
    )?.value;

    const [sendPayment] = usePostPaymentMutation();
    return (
        <View style={globalStyles.screenContainer}>
            <View style={{ flex: 3 }}>
                <Text style={globalStyles.textH1}>Confirm Payment</Text>
                <Text style={globalStyles.textBody}>
                    Amount: {invoiceAmount / 1000} SATS
                </Text>
                <Text style={globalStyles.textBody}>Memo: {memo || 'NA'}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems:'center' }}>
                {isLoading ? <Text style={globalStyles.textBody}>loading...</Text> : undefined}
                <CustomButton
                    text="Send Payment!"
                    buttonConfig={{
                        onPress: async () => {
                            setIsLoading(true)
                            const result = await sendPayment({ invoice });
                            if (result.data?.decoded?.payment_hash) {
                                alert('Success!')
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'WalletHomeScreen' }],
                                  });
                                  return
                            }
                            alert(result.data?.message);
                            setIsLoading(false)
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