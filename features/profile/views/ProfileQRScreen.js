import { View, Text, useWindowDimensions } from "react-native";
import React from "react";
import QRCode from "react-qr-code";
import { encodePubkey } from "../../../utils/nostr/keys";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { colors, globalStyles } from "../../../styles";

const ProfileQRScreen = ({ route }) => {
    const { pk } = route.params;
    const npub = encodePubkey(pk);
    const user = useSelector((state) => state.messages.users[pk]);
    const { height, width } = useWindowDimensions();
    return (
        <View
            style={[
                globalStyles.screenContainer,,
            ]}
        >
            <View>
                <Image
                    source={
                        user?.picture ||
                        require("../../../assets/user_placeholder.jpg")
                    }
                    style={{
                        width: width / 4,
                        height: width / 4,
                        borderRadius: width / 8,
                        borderWidth: 1,
                        borderColor: colors.primary500,
                    }}
                />
                <Text style={globalStyles.textBodyBold}>
                    {user.name || pk.slice(0, 16)}
                </Text>
            </View>
            <View style={{width: '50%', height: 1, backgroundColor: colors.primary500, marginVertical: 32}}/>
            <View>
                <View
                    style={{
                        backgroundColor: "white",
                        padding: 6,
                        borderRadius: 10,
                    }}
                >
                    <QRCode value={`nostr:${npub}`} size={(width / 100) * 75} />
                </View>
            </View>
        </View>
    );
};

export default ProfileQRScreen;
