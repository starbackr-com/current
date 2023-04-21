import { View, Text, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import globalStyles from "../../../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const placeholder = require("../../../assets/user_placeholder.jpg")

const UserBanner = ({ user, event, width, isZapped }) => {
    const imageDimensions = (width / 100) * 12;
    const navigation = useNavigation();

    return (
        <Pressable
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
                width: "100%",
            }}
            onPress={() => {
                navigation.navigate("Profile", {
                    screen: "ProfileScreen",
                    params: { pubkey: event.pubkey, name: user?.name || event.pubkey.slice(0,16) },

                });
            }}
        >
            <Image
                source={
                    user?.picture || placeholder
                }
                style={{
                    width: imageDimensions,
                    height: imageDimensions,
                    borderRadius: imageDimensions / 2,
                }}
                recyclingKey={event.pubkey}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                    style={[globalStyles.textBodyBold, { textAlign: "left" }]}
                >
                    {user?.name || event.pubkey.slice(0, 16)}
                </Text>
                <Text
                    style={[
                        globalStyles.textBodyS,
                        { textAlign: "left" },
                    ]}
                >
                    {user?.nip05}
                    <Ionicons
                        name={user?.nip05 ? "checkbox" : "close-circle"}
                    />
                </Text>
            </View>
        </Pressable>
    );
};

export default UserBanner;
