import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import CustomButton from "../../components/CustomButton";
import { bech32, bech32m } from "bech32";
import { decodeLnurl } from "../../utils/bitcoin/lnurl";

const WalletSendLnurlScreen = ({ route, navigation }) => {
    const [minSendable, setMinSendable] = useState();
    const [maxSendable, setMaxSendable] = useState();
    const [callback, setCallback] = useState();
    const [amount, setAmount] = useState();
    const { address, lnurl } = route.params;

    const fetchFromAddress = async (address) => {
        const [username, url] = address.split("@");
        try {
            const response = await fetch(
                `https://${url}/.well-known/lnurlp/${username}`
            );
            const { callback, minSendable, maxSendable } =
                await response.json();
            setMinSendable(minSendable);
            setMaxSendable(maxSendable);
            setCallback(callback);
        } catch (err) {}
    };

    const fetchFromLnurl = async (lnurl) => {
        const url = decodeLnurl(lnurl)
        const response = await fetch(url)
        const {callback, maxSendable, minSendable} = await response.json()
            setMinSendable(minSendable);
            setMaxSendable(maxSendable);
            setCallback(callback);

    };

    const sendHandler = async () => {
        if (amount > maxSendable / 1000 || amount < minSendable / 1000) {
            alert("Selected amount is either tot high or too low...");
            return;
        }
        const response = await fetch(`${callback}?amount=${amount * 1000}`);
        const data = await response.json();
        const invoice = data.pr;
        navigation.navigate("Wallet", {
            screen: "WalletConfirmScreen",
            params: { invoice: invoice },
        });
    };

    useEffect(() => {
        if (address) {
            fetchFromAddress(address);
        }
        if (lnurl) {
            console.log(lnurl)
            fetchFromLnurl(lnurl);
        }
    }, []);

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Send a payment</Text>
            <Text style={[globalStyles.textBody, { marginBottom: 16 }]}>
                Sending to {address || lnurl}
            </Text>
            {maxSendable ? (
                <View style={{ marginBottom: 16 }}>
                    <Text style={globalStyles.textBody}>
                        Send an amount between {minSendable / 1000} and{" "}
                        {maxSendable / 1000} SATS.
                    </Text>
                </View>
            ) : undefined}
            <Text>{amount}</Text>
            <Input
                label="Enter amount"
                inputStyle={{ width: "50%", marginBottom: 16 }}
                textInputConfig={{
                    keyboardType: "number-pad",
                    onChangeText: setAmount,
                }}
            />
            <CustomButton text="Send" buttonConfig={{ onPress: sendHandler }} />
        </View>
    );
};

export default WalletSendLnurlScreen;
