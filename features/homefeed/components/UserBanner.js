import { View, Text, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import globalStyles from "../../../styles/globalStyles";
import colors from "../../../styles/colors";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
    withTiming,
    useAnimatedStyle,
    interpolateColor,
    useDerivedValue,
} from "react-native-reanimated";

const UserBanner = ({ user, event, width, isZapped }) => {
    const imageDimensions = (width / 100) * 12;
    const navigation = useNavigation();

    const bgProgress = useDerivedValue(() => {
        return withTiming(isZapped ? 1 : 0);
    });

    const textStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            bgProgress.value,
            [0, 1],
            ["#ffffff", colors.backgroundPrimary]
        );

        return { color };
    });

    const addressStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            bgProgress.value,
            [0, 1],
            [colors.primary500, colors.backgroundPrimary]
        );

        return { color };
    });

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
                    user?.picture ||
                    require("../../../assets/user_placeholder.jpg")
                }
                style={{
                    width: imageDimensions,
                    height: imageDimensions,
                    borderRadius: imageDimensions / 2,
                }}
                placeholder={require("../../../assets/user_placeholder.jpg")}
                recyclingKey={event.pubkey}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Animated.Text
                    style={[globalStyles.textBodyBold, { textAlign: "left" }, textStyle]}
                >
                    {user?.name || event.pubkey.slice(0, 16)}
                </Animated.Text>
                <Animated.Text
                    style={[
                        globalStyles.textBodyS,
                        { textAlign: "left" }, addressStyle,
                    ]}
                >
                    {user?.nip05}
                    <Ionicons
                        name={user?.nip05 ? "checkbox" : "close-circle"}
                    />
                </Animated.Text>
            </View>
        </Pressable>
    );
};

export default UserBanner;
