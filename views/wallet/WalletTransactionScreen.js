import { View, Text } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import {
    useGetIncomingTransactionsQuery,
    useGetOutgoingTransactionsQuery,
} from "../../services/walletApi";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "../../components/CustomButton";
import { colors, globalStyles } from "../../styles";

const getAge = (timestamp) => {
    const now = new Date();
    const timePassedInMins = Math.floor(
        (now - new Date(timestamp * 1000)) / 1000 / 60
    );

    if (timePassedInMins < 60) {
        return `${timePassedInMins}min ago`;
    } else if (timePassedInMins >= 60 && timePassedInMins < 1440) {
        return `${Math.floor(timePassedInMins / 60)}h ago`;
    } else if (timePassedInMins >= 1440 && timePassedInMins < 10080) {
        return `${Math.floor(timePassedInMins / 1440)}d ago`;
    } else {
        return `on ${new Date(timestamp * 1000).toLocaleDateString()}`;
    }
}; 

const TxItem = ({ type, amount, memo, item }) => {
    let status = 'red';

    if (item.status === 'created') {
        status = 'grey'
    }
    if (item.status === 'paid' && type === 'in') {
        status = 'green'
    }
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
                color={status}
                size={24}
            />
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    overflow: 'hidden'
                }}
            >
                <Text style={globalStyles.textBody}>{amount}</Text>
                <Text style={[globalStyles.textBodyS, {maxWidth: '80%'}]}>{memo || ""}</Text>
                <Text style={[globalStyles.textBodyS]}>{getAge(item.createdat)}</Text>
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
                            item={item}
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
                            item={item}
                            type="out"
                            amount={item.amount}
                            memo={item.memo}
                        />
                    )}
                    estimatedItemSize={32}
                />
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <CustomButton text='Back' secondary buttonConfig={{onPress: () => {navigation.goBack()}}}/>
            </View>
        </View>
    );
};

export default WalletTransactionScreen;
