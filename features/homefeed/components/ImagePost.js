import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable, Alert } from "react-native";
import colors from "../../../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { decodeLnurl } from "../../../utils/bitcoin/lnurl";
import { usePostPaymentMutation } from "../../../services/walletApi";
import { useState } from "react";
import Animated, {
    withSequence,
    withTiming,
    withRepeat,
    useAnimatedStyle,
} from "react-native-reanimated";
import globalStyles from "../../../styles/globalStyles";
import { Image } from "expo-image";

import reactStringReplace from "react-string-replace";
import { useCallback } from "react";

const FeedImage = ({ size, images }) => {
    const navigation = useNavigation();
    const blurhash =
        "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
    return (
        <Pressable
            style={{ height: size, width: size }}
            onPress={() => {
                navigation.navigate("ImageModal", { imageUri: images });
            }}
        >
            <Image
                source={images[0]}
                style={{ height: size, width: size }}
                contentFit="cover"
                placeholder={blurhash}
            />
            {images.length > 1 ? (
                <Text
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: colors.primary500,
                    }}
                >{`+${images.length - 1}`}</Text>
            ) : undefined}
        </Pressable>
    );
};

const ImagePost = ({ item, height, width, user, zapSuccess, zapAmount }) => {
    const [isLoading, setIsLoading] = useState();
    const [sendPayment] = usePostPaymentMutation();
    const navigation = useNavigation();
    const [hasMore, setHasMore] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [numOfLines, setNumOfLines] = useState(NUM_LINES);
    const readMoreText = showMore ? "Show Less" : "Read More...";
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
        if (event.mentions.length < 1) {
            return event.content;
        }
        let content = event.content;
        content = reactStringReplace(content, /#\[([0-9]+)]/, (m, i) => {
            console.log(i);
            console.log(event.mentions[i - 1]);
            console.log(event);
            return (
                <Text
                    style={{ color: colors.primary500 }}
                    onPress={() => {
                        navigation.navigate("ProfileModal", {
                            pubkey: event.tags[i - 1][1],
                        });
                    }}
                    key={i}
                >
                    {event.mentions[i - 1]?.mention}
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
            const { callback, minSendable } = await response.json();
            const amount =
                minSendable / 1000 > zapAmount ? minSendable / 1000 : zapAmount;
            Alert.alert(
                "Zap",
                `Do you want to send ${amount} SATS to ${
                    user.name || user.pubkey
                }?`,
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
            const { callback, minSendable } = await response.json();
            const amount =
                minSendable / 1000 > zapAmount ? minSendable / 1000 : zapAmount;
            Alert.alert(
                "Zap",
                `Do you want to send ${amount} SATS to ${
                    user.name || user.pubkey
                }?`,
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

    const NUM_LINES = 2;
    let content = item.content

    if (item.mentions) {
        content = parseMentions(item)
    }

    const textLayout = (e) => {
        setHasMore(e.nativeEvent.lines.length > NUM_LINES);
        setNumOfLines(e.nativeEvent.lines.length);
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
                        marginBottom: 16,
                        width: "85%",
                        height: "90%",
                        borderRadius: 10,
                        justifyContent: "space-evenly",
                    },
                ]}
            >
                <View
                    style={{
                        backgroundColor: colors.backgroundSecondary,
                        padding: 12,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                >
                    <Text
                        style={[
                            globalStyles.textBodyBold,
                            {
                                textAlign: "left",
                            },
                        ]}
                    >
                        {user?.name || pubkey}
                    </Text>
                </View>
                <FeedImage
                    size={((width - 32) / 100) * 85}
                    images={[item.image]}
                />
                <Pressable
                    style={({pressed}) => [{backgroundColor: colors.backgroundSecondary,
                        padding: 12,
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                    }, pressed ? {backgroundColor: '#333333'} : undefined]}
                    onPress={() => {navigation.navigate('ReadMoreModal', {content})}}
                >
                    <Text
                        onTextLayout={textLayout}
                        style={{
                            opacity: 0,
                            position: "absolute",
                        }}
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
                        numberOfLines={
                            !hasMore
                                ? NUM_LINES
                                : showMore
                                ? numOfLines
                                : NUM_LINES
                        }
                    >
                        {content}
                    </Text>
                    {hasMore && (
                        <View>
                            <Text style={[globalStyles.textBodyS, {color: colors.primary500, textAlign: 'left'}]}>{readMoreText}</Text>
                        </View>
                    )}
                    <Text
                        style={[
                            globalStyles.textBodyS,
                            { textAlign: "right", padding: 4 },
                        ]}
                    >
                        {age}
                    </Text>
                </Pressable>
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
                                navigation.navigate("ProfileModal", {
                                    pubkey: user.pubkey,
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
                                    require("../../../assets//user_placeholder.jpg")
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

export default ImagePost;
