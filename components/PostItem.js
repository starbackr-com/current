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
import FeedImage from "./Images/FeedImage";
import { getAge } from "../features/shared/utils/getAge";
import { useParseContent } from "../hooks/useParseContent";

const PostItem = ({
    item,
    height,
    width,
    user,
    zapSuccess,
    zapAmount,
    zaps,
}) => {
    const [isLoading, setIsLoading] = useState();
    const [sendPayment] = usePostPaymentMutation();
    const navigation = useNavigation();
    const [hasMore, setHasMore] = useState(false);
    const [numOfLines, setNumOfLines] = useState();
    const [textContainerHeight, setTextContaienrHeight] = useState()
    const readMoreText = "Read More...";
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

    const content = useParseContent(item);

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
                    },
                ]
            );
            return;
        }
        setIsLoading(true);
        try {
            const dest = user.lud06 || user.lud16;
            const name = user.name || user.pubkey.slice(0, 12);
            const url = dest.includes("@")
                ? `https://${dest.split("@")[1]}/.well-known/lnurlp/${
                      dest.split("@")[0]
                  }`
                : decodeLnurl(dest);
            const response = await fetch(url);
            const { callback, minSendable, allowsNostr, nostrPubkey } =
                await response.json();

            const amount =
                minSendable / 1000 > zapAmount ? minSendable / 1000 : zapAmount;

            Alert.alert(
                "Zap",
                `Do you want to send ${zapAmount} SATS to ${name}?`,
                [
                    {
                        text: "Yes!",
                        onPress: async () => {
                            let response;
                            if (allowsNostr && nostrPubkey) {
                                let tags = [];
                                tags.push(["p", nostrPubkey]);
                                tags.push(["e", item.id]);
                                // tags.push(["amount", amount * 1000]);

                                const zapevent = await createZapEvent("", tags);
                                response = await fetch(
                                    `${callback}?amount=${
                                        amount * 1000
                                    }&nostr=${JSON.stringify(zapevent)}`
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
                            console.log(result);
                            if (!result.data.error) {
                                alert(
                                    `⚡ 🎉 Zap success: ${amount} SATS to ${name} `
                                );
                                setIsLoading(false);
                            } else {
                                alert("Zap Failed");
                                setIsLoading(false);
                            }
                            return;
                        },
                    },
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                ]
            );
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    };

    const age = getAge(created_at);

    const textLayout = (e) => {
        const lineHeight = e.nativeEvent.lines[0].height
        const containerHeight = ((height / 100 * 90 / 100) * 90);
        const maxLines = containerHeight / lineHeight
        const numOfLines = e.nativeEvent.lines.length
        console.log(`numOfLines: ${numOfLines}, maxLines: ${maxLines}`)
        if (numOfLines > maxLines - 5) {
            setHasMore(true);
        } else {
            setHasMore(false)
        }
        setNumOfLines(maxLines - 5);
    };

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
                <View>
                    <Text
                        style={[
                            globalStyles.textBodyBold,
                            { textAlign: "left" },
                        ]}
                    >
                        {user?.name || pubkey}
                    </Text>
                    <Text
                        onTextLayout={textLayout}
                        style={[
                            globalStyles.textBody,
                            {
                                opacity: 0,
                                position: "absolute",
                            },
                        ]}
                    >
                        {content}
                    </Text>
                    <Text
                        style={[
                            globalStyles.textBody,
                            {
                                textAlign: "left",
                            },
                        ]}
                        numberOfLines={numOfLines}
                    >
                        {content}
                    </Text>
                    {hasMore && (
                        <View>
                            <Text
                                style={[
                                    globalStyles.textBodyS,
                                    {
                                        color: colors.primary500,
                                        textAlign: "left",
                                    },
                                ]}
                            >
                                {readMoreText}
                            </Text>
                        </View>
                    )}
                    {item.image ? (
                        <FeedImage
                            size={((width - 32) / 100) * 70}
                            images={[item.image]}
                        />
                    ) : undefined}
                </View>
                <View
                    style={{
                        width: "100%",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    {zaps ? (
                        // <Pressable onPress={() => {navigation.navigate('ZapListModal', {zaps})}}>
                        <Pressable
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={[
                                    globalStyles.textBodyS,
                                    {
                                        textAlign: "left",
                                        color: colors.primary500,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="flash-outline"
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                />{" "}
                                {zaps.amount}
                            </Text>
                        </Pressable>
                    ) : (
                        <View></View>
                    )}
                    <Text
                        style={[
                            globalStyles.textBodyS,
                            { textAlign: "right", padding: 4 },
                        ]}
                    >
                        {age}
                    </Text>
                </View>
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
                            type: "root",
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
