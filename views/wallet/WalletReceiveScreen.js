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
            <Text style={globalStyles.textH1}>Receive a Payment</Text>
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
                    }}
                    inputStyle={{ width: "50%", marginBottom: 12 }}
                    label="Amount in USD"
                    invalid={error}
                />
                <Input
                    textInputConfig={{
                        autoFocus: true,
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
                                amtinusd: amount,
                                memo: memo,
                            }).unwrap();
                            console.log(response);
                            navigation.navigate("WalletInvoiceScreen", {
                                invoice: response.pay_req,
                            });
                        },
                    }}
                />
            </View>
            <View style={{ flex: 1 }}>
                <CustomButton text="Use Bitcoin Address" />
                <CustomButton
                    text="Back"
                    buttonConfig={{
                        onPress: () => {
                            navigation.goBack();
                        },
                    }}
                    containerStyles={{marginTop: 16, justifyContent: 'center'}}
                />
            </View>
        </View>
    );
};

export default WalletReceiveScreen;
