import { View, Text } from "react-native";
import React, { useEffect } from "react";
import globalStyles from "../../styles/globalStyles";
import { FlashList } from "@shopify/flash-list";
import {
    useGetIncomingTransactionsQuery,
    useGetOutgoingTransactionsQuery,
} from "../../services/walletApi";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../styles/colors";
import CustomButton from "../../components/CustomButton";

const TxItem = ({ type, amount, memo }) => {
    return (
        <View
            style={{
                backgroundColor: colors.backgroundSecondary,
                padding: 6,
                borderRadius: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: 'center',
                marginBottom: 4
            }}
        >
            <Ionicons
                name={type === "in" ? "arrow-down" : "arrow-up"}
                color={type === "in" ? "green" : "red"}
                size={24}
            />
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Text style={globalStyles.textBody}>{amount}</Text>
                <Text style={globalStyles.textBody}>{memo || ""}</Text>
            </View>
        </View>
    );
};

const WalletTransactionScreen = ({navigation}) => {
    const { data: incoming } = useGetIncomingTransactionsQuery();
    const { data: outgoing } = useGetOutgoingTransactionsQuery();
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textBodyS}>Incoming</Text>
            <View style={{ flex: 2, width: "100%" }}>
                <FlashList
                    data={incoming}
                    renderItem={({ item }) => (
                        <TxItem
                            type="in"
                            amount={item.amount}
                            memo={item.memo}
                        />
                    )}
                    estimatedItemSize={32}
                />
            </View>
            <Text style={globalStyles.textBodyS}>Outgoing</Text>
            <View style={{ flex: 2, width: "100%" }}>
                <FlashList
                    data={outgoing}
                    renderItem={({ item }) => (
                        <TxItem
                            type="out"
                            amount={item.amount}
                            memo={item.memo}
                        />
                    )}
                    estimatedItemSize={32}
                />
            </View>
            <View style={{flex: 1}}>
              <CustomButton text='Back' secondary buttonConfig={{onPress: () => {navigation.goBack()}}}/>
            </View>
        </View>
    );
};

export default WalletTransactionScreen;
