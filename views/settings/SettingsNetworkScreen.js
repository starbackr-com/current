import { View, Text } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import { relays } from "../../utils/nostrV2";
import Ionicons from "@expo/vector-icons/Ionicons";

const RelayItem = ({ relay }) => {
    let status;
    if (relay.status === 1) {
        status = 'green'
    }
    if (relay.status === 0) {
        status = 'yellow'
    }
    if (relay.status === 2 || relay.status === 3) {
        status = 'red'
    }
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#222222",
                padding: 12,
                borderRadius: 10,
                marginBottom: 12,
                width: '100%'
            }}
        >
            <Ionicons
                name="cloud-circle"
                color={status}
            />
            <Text style={globalStyles.textBody}>{relay.url}</Text>
        </View>
    );
};

const SettingsNetworkScreen = () => {
    console.log(relays);
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textBodyBold}>Relays</Text>
            <View style={{width: '80%'}}>
                {relays.map((relay) => (
                    <RelayItem relay={relay} key={relay.url} />
                ))}
            </View>
        </View>
    );
};

export default SettingsNetworkScreen;
