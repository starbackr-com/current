import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable, Alert } from "react-native";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { decodeLnurl } from "../utils/bitcoin/lnurl";
import { usePostPaymentMutation } from "../services/walletApi";
import { useState } from "react";
import { createZapEvent } from "../utils/nostrV2/publishEvents";
import Animated, {
    withSequence,
    withTiming,
    withRepeat,
    useAnimatedStyle,
} from "react-native-reanimated";
import globalStyles from "../styles/globalStyles";
import { Image } from "expo-image";

import reactStringReplace from "react-string-replace";
import { useCallback } from "react";
import FeedImage from "./Images/FeedImage";
import { httpRegex } from "../constants";
import * as Linking from "expo-linking";

const PostItem = ({ item, height, width, user, zapSuccess, zapAmount }) => {
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
        let content = event.content;
        content = reactStringReplace(content, /#\[([0-9]+)]/, (m, i) => {
            return (
                <Text
                    style={{ color: colors.primary500 }}
                    onPress={() => {
                        navigation.navigate("Profile", {
                            screen: "ProfileScreen",
                            params: { pubkey: event.tags[i - 1][1] },
                        });
                    }}
                    key={i}
                >
                    {event.mentions[i - 1]?.mention}
                </Text>
            );
        });


        content = reactStringReplace(content, /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/, (m, i) => {
            return (
                <Text style={{ color: colors.primary500 }} onPress={() => {Linking.openURL(m)}} key={m}>
                    {m}
                </Text>
            );
        });
        return content;
    }, []);

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
    const blurhash = "LEHLh[WB2yk8pyoJadR*.7kCMdnj";

    const zapHandler = async () => {
        if (!zapAmount) {
            Alert.alert(
                "No Zap-Amount set!",
                `In order to Zap a post you will need to set a default Zap-Amount first`,
                [
                    {
                        text: "Settings",
                        onPress: () => {
                            navigation.navigate("Settings", {
                                screen: "Payments",
                            });
                        },
                    },
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => {
                            return;
                        },
                    },
                ]
            );
        }
        setIsLoading(true);
        if (user.lud06 && zapAmount) {
            const dest = user.lud06.toLowerCase();
            const url = decodeLnurl(dest);
            const response = await fetch(url);
            const { callback, minSendable, allowsNostr, nostrPubkey } = await response.json();
            const amount =
                minSendable / 1000 > zapAmount ? minSendable / 1000 : zapAmount;
            console.log('checking', amount);
            Alert.alert(
                "Zap",
                `Do you want to send ${amount} SATS to ${
                    user.name || user.pubkey
                }?`,
                [
                    {
                        text: "OK",
                        onPress: async () => {
                            let response;
                            if (allowsNostr && nostrPubkey) {
                                let tags = [];
                                tags.push((['p', nostrPubkey]));
                                tags.push(['e', item.id]);
                                tags.push(['amount', (amount * 1000) ]);

                                const zapevent = await createZapEvent('', tags);

                                console.log(zapevent);

                                response = await fetch(
                                    `${callback}?amount=${amount * 1000}&nostr=${JSON.stringify(zapevent)}`
                                );

                            } else {
                                response = await fetch(
                                    `${callback}?amount=${amount * 1000}`
                                );
                            }
                            const data = await response.json();
                            const invoice = data.pr;
                            const result = await sendPayment({
                                amount,
                                invoice,
                            });
                            if (result.data?.message?.status === "SUCCEEDED") {
                                setIsLoading(false);
                                zapSuccess();
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
        } else if (user.lud16 && zapAmount) {
            const dest = user.lud16.toLowerCase();
            const [username, domain] = dest.split("@");
            const response = await fetch(
                `https://${domain}/.well-known/lnurlp/${username}`
            );
            const { callback, minSendable, allowsNostr, nostrPubkey } = await response.json();

            const amount =
                minSendable / 1000 > zapAmount ? minSendable / 1000 : zapAmount;

            console.log('checking else', amount);

            Alert.alert(
                "Zap",
                `Do you want to send ${amount} SATS to ${
                    user.name || user.pubkey
                }?`,
                [
                    {
                        text: "OK",
                        onPress: async () => {

                            let response;
                            if (allowsNostr && nostrPubkey) {
                                let tags = [];
                                tags.push((['p', nostrPubkey]));
                                tags.push(['e', item.id]);
                                tags.push(['amount', (amount * 1000) ]);

                                const zapevent = await createZapEvent('', tags);

                                console.log(zapevent);

                                response = await fetch(
                                    `${callback}?amount=${amount * 1000}&nostr=${JSON.stringify(zapevent)}`
                                );

                            } else {
                                response = await fetch(
                                    `${callback}?amount=${amount * 1000}`
                                );
                            }
                            const data = await response.json();
                            const invoice = data.pr;
                            const result = await sendPayment({
                                amount,
                                invoice,
                            });
                            if (result.data?.message?.status === "SUCCEEDED") {
                                setIsLoading(false);
                                zapSuccess();
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
                height: (height / 100) * 90,
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
                        height: "90%",
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
                        {parseMentions(item)}
                    </Text>
                    {item.image ? (
                        <FeedImage
                            size={((width - 32) / 100) * 70}
                            images={[item.image]}
                        />
                    ) : undefined}
                </View>
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
                                navigation.navigate("Profile", {
                                    screen: "ProfileScreen",
                                    params: { pubkey: user.pubkey },
                                });
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
                                cachePolicy="memory-disk"
                                source={
                                    user.picture ||
                                    require("../assets//user_placeholder.jpg")
                                }
                                contentFit="contain"
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
                            rootId: item.id,
                            type: 'root'
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
