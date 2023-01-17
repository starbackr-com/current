import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import Input from "../../components/Input";
import globalStyles from "../../styles/globalStyles";

const WalletSendScreen = ({ navigation, route }) => {
    const [inputText, setInputText] = useState("");
    const invoice = route.params?.data;
    useEffect(() => {
        if (invoice) {
            setInputText(invoice);
        }
    }, []);

    const nextHandler = () => {
        if (!inputText.includes("lnbc1")) {
            alert(
                "This is not a valid Lightning Invoice. Only sending to Lightning Wallets is support right now..."
            );
            return;
        }
        navigation.navigate("WalletConfirmScreen", { invoice: inputText });
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Send a payment</Text>
            <Input
                inputStyle={{ width: "80%" }}
                label="Invoice/Address"
                textInputConfig={{
                    placeholder: "Invoice/Address",
                    value: inputText,
                    onChangeText: (e) => {
                        setInputText(e);
                    },
                }}
            />
            <CustomButton
                text="Next"
                containerStyles={{ marginTop: 36 }}
                disabled={inputText.length < 1}
                buttonConfig={{ onPress: nextHandler }}
            />
            <CustomButton
                text="Back"
                buttonConfig={{
                    onPress: () => {
                        navigation.goBack();
                    },
                }}
            />
        </View>
    );
};

export default WalletSendScreen;
