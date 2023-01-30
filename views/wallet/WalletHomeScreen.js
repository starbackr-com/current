import { View, Text, useWindowDimensions, Pressable } from "react-native";
import React from "react";
import { useGetWalletBalanceQuery } from "../../services/walletApi";
import globalStyles from "../../styles/globalStyles";
import colors from "../../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "../../components/CustomButton";
import { useIsFocused } from "@react-navigation/native";

const WalletHomeScreen = ({ navigation: { navigate } }) => {
    const { data, refetch } = useGetWalletBalanceQuery(null, {
        skip: !useIsFocused(),
    });

    const device = useWindowDimensions();
    return (
        <View style={globalStyles.screenContainer}>
            <View
                style={{ flex: 1, width: "100%", flexDirection: "row", justifyContent: 'space-between' }}
            >
                <Ionicons
                    name="reload"
                    color={colors.primary500}
                    size={32}
                    onPress={() => {
                        refetch();
                    }}
                />
                <Ionicons
                    name="information-circle"
                    color={colors.primary500}
                    size={32}
                    onPress={() => {
                        navigate("WalletInfoScreen");
                    }}
                />
            </View>
            <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={[globalStyles.textH1]}>
                    {data ? `${data.balance} SATS` : "Loading..."}
                </Text>
            </View>
            <View
                style={{
                    flex: 4,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        width: "70%",
                        justifyContent: "space-between",
                        marginBottom: device.height / 30,
                    }}
                >
                    <CustomButton
                        text="Transactions"
                        buttonConfig={{
                            onPress: () => {
                                navigate("WalletTransactionScreen");
                            },
                        }}
                        containerStyles={{ width: "100%" }}
                        icon="list"
                    />
                    <CustomButton
                        text="Send"
                        buttonConfig={{
                            onPress: () => {
                                navigate("WalletSendScreen");
                            },
                        }}
                        icon="arrow-up-circle"
                    />
                    <CustomButton
                        text="Receive"
                        buttonConfig={{
                            onPress: () => {
                                navigate("WalletReceiveScreen");
                            },
                        }}
                        containerStyles={{ width: "100%" }}
                        icon="arrow-down-circle"
                    />
                </View>
                <View style={{ alignItems: "center", flex: 1 }}>
                    <Pressable
                        style={{
                            width: device.width / 6,
                            height: device.width / 6,
                            borderRadius: device.width / 3,
                            backgroundColor: colors.primary500,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={() => {
                            navigate("ScannerScreen");
                        }}
                    >
                        <Ionicons
                            name="qr-code"
                            color="white"
                            size={device.width / 16}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default WalletHomeScreen;
