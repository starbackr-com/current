import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import * as React from "react";
import {
    useGetWalletBalanceQuery,
    usePostInvoiceMutation,
} from "../services/walletApi";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import QRCode from "react-qr-code";

const Stack = createStackNavigator();

const WalletHomeScreen = ({ navigation: { navigate } }) => {
    const { data, error, isLoading } = useGetWalletBalanceQuery();
    console.log(error)
    console.log(data)

    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {data ? `${data.BTC?.AvailableBalance} SATS` : "Loading..."}
            </Text>
            <View style={styles.actions}>
                <Button title="Send" />
                <Button
                    title="Receive"
                    onPress={() => {
                        navigate("WalletReceiveScreen");
                    }}
                />
            </View>
        </View>
    );
};

const WalletSendScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {data ? `${data.BTC.AvailableBalance} SATS` : "Loading..."}
            </Text>
            <View style={styles.actions}>
                <Button title="Send" />
                <Button title="Receive" />
            </View>
        </View>
    );
};

const WalletReceiveScreen = ({ navigation: { navigate, goBack } }) => {
    const [invoice, setInvoice] = useState();
    const [amount, setAmount] = useState("Test");

    const [postInvoice, results] = usePostInvoiceMutation();

    return (
        <View style={styles.container}>
            <Text>{amount}</Text>
            <TextInput
                style={styles.input}
                autoFocus={true}
                keyboardType="numeric"
                onChangeText={setAmount}
            />
            <View>
                <Button title="Get Invoice" onPress={ async () => {
                    const response = await postInvoice({amtinusd: amount, memo:'Testing Invoices'}).unwrap();
                    navigate('WalletInvoiceScreen', {invoice: response.pay_req})
                }} />
                <Button
                    title="Back"
                    onPress={() => {
                        goBack();
                    }}
                />
            </View>
        </View>
    );
};

const WalletInvoiceScreen = ({ route, navigation: { navigate, goBack } }) => {
    const invoice = route.params.invoice;
    return (
        <View style={styles.container}>
            <Text>Your Invoice</Text>
            <View style={styles.qrContainer}>
                <QRCode value={invoice} size={320}/>
            </View>
            <Button title="Back" onPress={() => {goBack()}}/>
        </View>
    );
};

const WalletView = () => {
    const { data, error, isLoading } = useGetWalletBalanceQuery();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="WalletHomeScreen"
                component={WalletHomeScreen}
                options={{
                    title: "WalletHomeScreen",
                }}
            />
            <Stack.Screen
                name="WalletSendScreen"
                component={WalletSendScreen}
                options={{
                    title: "WalletSendScreen",
                }}
            />
            <Stack.Screen
                name="WalletReceiveScreen"
                component={WalletReceiveScreen}
                options={{
                    title: "WalletReceiveScreen",
                }}
            /><Stack.Screen
            name="WalletInvoiceScreen"
            component={WalletInvoiceScreen}
            options={{
                title: "WalletInvoiceScreen",
            }}
        />
        </Stack.Navigator>
    );
};

export default WalletView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#18181b",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },

    text: {
        color: "white",
        textAlign: "center",
        margin: 12,
    },
    input: {
        height: 40,
        margin: 12,
        paddingHorizontal1: 32,
        color: "white",
        backgroundColor: "grey",
    },
    actions: {
        flexDirection: 'row'
    },
    qrContainer: {
        padding: 10,
        backgroundColor:'white',
        borderRadius: 4
    }
});
