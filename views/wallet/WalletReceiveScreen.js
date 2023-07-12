import { View, Text } from "react-native";
import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import Input from "../../components/Input";
import { usePostInvoiceMutation } from "../../services/walletApi";
import globalStyles from "../../styles/globalStyles";

const WalletReceiveScreen = ({ navigation }) => {
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");
    const [error, setError] = useState(false);

    const [postInvoice, results] = usePostInvoiceMutation();

    const changeHandler = (amount) => {
        if (amount.length > 0) {
            setError(false);
        }
        const newAmount = amount.replace(",", ".");
        setAmount(newAmount);
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textBodyBold}>Receive a Payment</Text>
            <View
                style={{
                    flex: 5,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Input
                    textInputConfig={{
                        autoFocus: true,
                        keyboardType: "numeric",
                        onChangeText: changeHandler,
                        placeholder: 'in SATS'
                    }}
                    inputStyle={{ width: "50%", marginBottom: 12 }}
                    label="Amount"
                    invalid={error}
                />
                <Input
                    textInputConfig={{
                        onChangeText: setMemo,
                    }}
                    inputStyle={{ width: "50%", marginBottom: 12 }}
                    label="Optional: Memo"
                />
                <CustomButton
                    text="Confirm"
                    buttonConfig={{
                        onPress: async () => {
                            if (amount.length < 1) {
                                setError(true);
                                return;
                            }
                            const response = await postInvoice({
                                amount: amount,
                                description: memo,
                            }).unwrap();
                            console.log(response);
                            navigation.navigate("WalletInvoiceScreen", {
                                invoice: response.payment_request,
                            });
                        },
                    }}
                />
            </View>
        </View>
    );
};

export default WalletReceiveScreen;
