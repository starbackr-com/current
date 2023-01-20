import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import Input from "../../components/Input";
import globalStyles from "../../styles/globalStyles";

const WalletSendScreen = ({ navigation, route }) => {
    const [inputText, setInputText] = useState("");
    const invoice = route.params?.data;

    const mailRegex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/


    useEffect(() => {
        if (invoice) {
            setInputText(invoice);
        }
    }, []);

    const nextHandler = () => {
        const address = inputText.toLowerCase().match(mailRegex)
        console.log(address)
        if (!inputText.includes("lnbc") && !address && !inputText.includes('lnurl')) {
            alert(
                "This is not a valid Lightning Invoice / Lightning Address / LNURL"
            );
            return;
        } else if (address) {
            navigation.navigate('WalletSendLnurlScreen', {address: address[0]})
        } else if (inputText.toLowerCase().includes('lnurl')) {
            navigation.navigate('WalletSendLnurlScreen', {lnurl: inputText.toLowerCase()})
        } else {
            navigation.navigate("WalletConfirmScreen", { invoice: inputText });
        }
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Send a payment</Text>
            <Input
                inputStyle={{ width: "80%" }}
                label="Invoice/Address"
                textInputConfig={{
                    placeholder: "Invoice/Address",
                    autoCapitalize: false,
                    value: inputText,
                    onChangeText: (e) => {
                        setInputText(e.toLowerCase());
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
