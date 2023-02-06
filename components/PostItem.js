import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable, Alert } from "react-native";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { decodeLnurl } from "../utils/bitcoin/lnurl";
import { usePostPaymentMutation } from "../services/walletApi";
import { useState } from "react";
import Animated, {
    withSequence,
    withTiming,
    withRepeat,
    useAnimatedStyle,
} from "react-native-reanimated";
import globalStyles from "../styles/globalStyles";
import {Image} from 'expo-image'

import reactStringReplace from "react-string-replace";
import { useCallback } from "react";

const PostItem = ({ item, height, width, user }) => {
    const [profileActive, setProfileActive] = useState(false);
    const [isLoading, setIsLoading] = useState();
    const [sendPayment] = usePostPaymentMutation();
    const navigation = useNavigation();
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withSequence(
                withTiming(0.1, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        ),
    }));

    const parseMentions = useCallback((event) => {
        if (event.tags.length < 1) {
            return event.content;
        }
        let content = event.content;
        content = reactStringReplace(content, /#\[([0-9]+)]/, (m, i) => {
            return (
                <Text
                    style={{ color: colors.primary500 }}
                    onPress={() => {
                        console.log("Following...");
                    }}
                    key={i}
                >
                    {event.tags[i - 1][1]}
                </Text>
            );
        });
        return content;
    }, [])

    const getAge = useCallback((timestamp) => {
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
    }, []);

    const { created_at, pubkey } = item;
    const blurhash = 'LEHLh[WB2yk8pyoJadR*.7kCMdnj'

    const tipHandler = () => {
        const dest = user.lud06.toLowerCase();
        if (dest.includes("lnurl")) {
            navigation.navigate("Wallet", {
                screen: "WalletSendLnurlScreen",
                params: { lnurl: dest },
            });
            return;
        }
        if (dest.includes("@")) {
            navigation.navigate("Wallet", {
                screen: "WalletSendLnurlScreen",
                params: { address: dest },
            });
            return;
        }
        alert("Unknown Tip-Format");
    };

    const zapHandler = async () => {
        setIsLoading(true);
        if (user.lud06) {
            const dest = user.lud06.toLowerCase();
            const url = decodeLnurl(dest);
            const response = await fetch(url);
            const { callback, maxSendable, minSendable } =
                await response.json();
            const amount = minSendable / 1000 > 210 ? minSendable / 1000 : 210;
            Alert.alert(
                "Zap",
                `Do you want to send ${amount} SATS to ${
                    user.name || user.pubkey
                }?
                
(Hold Zap-Icon for custom amount)`,
                [
                    {
                        text: "OK",
                        onPress: async () => {
                            const response = await fetch(
                                `${callback}?amount=${amount * 1000}`
                            );
                            const data = await response.json();
                            const invoice = data.pr;
                            const result = await sendPayment({
                                amount: 210,
                                invoice,
                            });
                            if (result.data?.message?.status === "SUCCEEDED") {
                                setIsLoading(false);
                                alert("Success!");
                                return;
                            }
                            alert(result.data?.message);
                            setIsLoading(false);
                        },
                    },
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => {
                            setIsLoading(false);
                        },
                    },
                ]
            );
        } else if (user.lud16) {
            const dest = user.lud16.toLowerCase();
            const [username, domain] = dest.split("@");
            const response = await fetch(
                `https://${domain}/.well-known/lnurlp/${username}`
            );
            const { callback, minSendable } = await response.json();
            const amount = minSendable / 1000 > 210 ? minSendable / 1000 : 210;
            Alert.alert(
                "Zap",
                `Do you want to send ${amount} SATS to ${
                    user.name || user.pubkey
                }?
                
(Hold Zap-Icon for custom amount)`,
                [
                    {
                        text: "OK",
                        onPress: async () => {
                            const response = await fetch(
                                `${callback}?amount=${amount * 1000}`
                            );
                            const data = await response.json();
                            const invoice = data.pr;
                            const result = await sendPayment({
                                amount: 210,
                                invoice,
                            });
                            if (result.data?.message?.status === "SUCCEEDED") {
                                setIsLoading(false);
                                alert("Success!");
                                return;
                            }
                            console.log(result);
                            setIsLoading(false);
                        },
                    },
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => {
                            setIsLoading(false);
                        },
                    },
                ]
            );
        }
        return;
    };

    const age = getAge(created_at);

    return (
        <View
            style={{
                height: (height / 100) * 80,
                width: width - 32,
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <View
                style={[
                    {
                        backgroundColor: "#222222",
                        marginBottom: 16,
                        width: "85%",
                        height: "80%",
                        padding: 12,
                        borderRadius: 10,
                        justifyContent: "space-between",
                    },
                ]}
            >
                <View style={{ maxHeight: "60%" }}>
                    <Text
                        style={[
                            globalStyles.textBodyBold,
                            { textAlign: "left" },
                        ]}
                    >
                        {user?.name || pubkey}
                    </Text>
                    <Text
                        style={[globalStyles.textBody, { textAlign: "left" }]}
                    >
                        {item.mentions ? parseMentions(item) : item.content}
                    </Text>
                </View>

                {item.image ? (
                    <Image
                        style={{
                            width: "100%",
                            height: "30%",
                            borderRadius: 10,
                            marginTop: 16,
                        }}
                        source={item.image}
                        placeholder={blurhash}
                        transition={1000}
                    />
                ) : undefined}
                <Text
                    style={[
                        globalStyles.textBody,
                        { textAlign: "right", padding: 4 },
                    ]}
                >
                    {age}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: "column",
                    width: "10%",
                }}
            >
                <View
                    style={{
                        width: (width / 100) * 8,
                        height: (width / 100) * 8,
                        borderRadius: (width / 100) * 4,
                        backgroundColor: colors.primary500,
                        marginBottom: 16,
                    }}
                >
                    {user ? (
                        <Pressable
                            onPress={() => {
                                setProfileActive((prev) => !prev);
                            }}
                        >
                            <Image
                                style={{
                                    width: (width / 100) * 8,
                                    height: (width / 100) * 8,
                                    borderRadius: (width / 100) * 4,
                                    backgroundColor: colors.primary500,
                                    borderColor: colors.primary500,
                                    borderWidth: 2,
                                }}
                                cachePolicy='memory-disk'
                                source={{ uri: user.picture }}
                                contentFit='contain'
                                placeholder={require('../assets/user_placeholder.jpg')}
                            />
                        </Pressable>
                    ) : undefined}
                </View>
                {user?.lud06 || user?.lud16 ? (
                    <Pressable
                        style={({ pressed }) => [
                            {
                                width: (width / 100) * 8,
                                height: (width / 100) * 8,
                                borderRadius: (width / 100) * 4,
                                backgroundColor: colors.primary500,
                                marginBottom: 16,
                                alignItems: "center",
                                justifyContent: "center",
                            },
                            pressed
                                ? { backgroundColor: "#777777" }
                                : undefined,
                        ]}
                        onPress={zapHandler}
                        onLongPress={tipHandler}
                    >
                        <Animated.View
                            style={isLoading ? animatedStyle : { opacity: 1 }}
                        >
                            <Ionicons
                                name="flash"
                                color="white"
                                size={(width / 100) * 5}
                            />
                        </Animated.View>
                    </Pressable>
                ) : undefined}
                <Pressable
                    style={{
                        width: (width / 100) * 8,
                        height: (width / 100) * 8,
                        borderRadius: (width / 100) * 4,
                        backgroundColor: colors.primary500,
                        marginBottom: 16,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {
                        navigation.navigate("CommentScreen", {
                            eventId: item.id,
                        });
                    }}
                >
                    <Ionicons
                        name="chatbubble-ellipses"
                        color="white"
                        size={(width / 100) * 5}
                    />
                </Pressable>
                <Pressable
                    style={{
                        width: (width / 100) * 8,
                        height: (width / 100) * 8,
                        borderRadius: (width / 100) * 4,
                        backgroundColor: colors.primary500,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {
                        navigation.navigate("PostMenuModal", { event: item });
                    }}
                >
                    <Ionicons
                        name="ellipsis-horizontal"
                        color="white"
                        size={(width / 100) * 5}
                    />
                </Pressable>
            </View>
        </View>
    );
};

export default PostItem;
