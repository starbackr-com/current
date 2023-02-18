import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable, Alert } from "react-native";
import colors from "../../../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { decodeLnurl } from "../../../utils/bitcoin/lnurl";
import { usePostPaymentMutation } from "../../../services/walletApi";
import { createZapEvent } from "../../../utils/nostrV2";
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
import { getAge } from "../../shared/utils/getAge";

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

const ImagePost = ({
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
        return content;
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
        if (user.lud16 && zapAmount) {
            const dest = user.lud16.toLowerCase();
            const [username, domain] = dest.split("@");
            const response = await fetch(
                `https://${domain}/.well-known/lnurlp/${username}`
            );
            const { callback, minSendable, allowsNostr, nostrPubkey } =
                await response.json();

            const amount =
                minSendable / 1000 > zapAmount ? minSendable / 1000 : zapAmount;

            console.log("checking else", amount);

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
                                tags.push(["p", nostrPubkey]);
                                tags.push(["e", item.id]);
                                // tags.push(["amount", amount * 1000]);

                                const zapevent = await createZapEvent("", tags);

                                console.log(zapevent);

                                response = await fetch(
                                    `${callback}?amount=${
                                        amount * 1000
                                    }&nostr=${JSON.stringify(zapevent)}`
                                );
                            } else {
                                console.log('inside not zap wallet');
                                alert(`Oops..! ${user.name || user.pubkey}'s wallet does not support Zaps!`);
                                setIsLoading(false);
                                return;

                            }
                            const data = await response.json();
                            const invoice = data.pr;
                            const result = await sendPayment({
                                amount,
                                invoice,
                            });
                            console.log(result);
                            setIsLoading(false);
                            if (result.data && !result.data.error) {
                                //zapSuccess();
                                alert(`🤑 🎉 Zap success: ${amount} SATS to ${
                                    user.name || user.pubkey
                                } `)
                            } else {
                              alert('Zap Failed');
                            }
                            return;
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
        } else if (user.lud06 && zapAmount) {
            console.log(user.lud06);
            const dest = user.lud06.toLowerCase();
            const url = decodeLnurl(dest);
            const response = await fetch(url);
            const { callback, minSendable, allowsNostr, nostrPubkey } =
                await response.json();
            const amount =
                minSendable / 1000 > zapAmount ? minSendable / 1000 : zapAmount;
            console.log("checking", amount);
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
                                tags.push(["p", nostrPubkey]);
                                tags.push(["e", item.id]);
                                // tags.push(["amount", amount * 1000]);

                                const zapevent = await createZapEvent("", tags);

                                console.log(zapevent);

                                response = await fetch(
                                    `${callback}?amount=${
                                        amount * 1000
                                    }&nostr=${JSON.stringify(zapevent)}`
                                );
                            } else {
                                    console.log('inside not zap wallet');
                                alert(`Oops..! ${user.name || user.pubkey}'s wallet does not support Zaps!`);
                                setIsLoading(false);
                                return;

                            }
                            const data = await response.json();
                            const invoice = data.pr;
                            const result = await sendPayment({
                                amount,
                                invoice,
                            });
                            console.log(result);
                            setIsLoading(false);
                            if (result.data && !result.data.error) {
                                //zapSuccess();
                                alert(`🤑 🎉 Zap success: ${amount} SATS to ${
                                    user.name || user.pubkey
                                } `)
                            } else {
                              alert('Zap Failed');
                            }
                            return;
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
    let content = item.content;

    if (item.mentions) {
        content = parseMentions(item);
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
                        backgroundColor: colors.backgroundSecondary,
                        justifyContent: 'space-between'
                    },
                ]}
            >
                <View
                    style={{
                        backgroundColor: colors.backgroundSecondary,
                        padding: 12,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomWidth: 1,
                        borderColor: colors.primary500,
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
                    style={({ pressed }) => [
                        {
                            backgroundColor: colors.backgroundSecondary,
                            padding: 12,
                            borderBottomRightRadius: 10,
                            borderBottomLeftRadius: 10,
                            borderTopWidth: 1,
                            borderColor: colors.primary500,
                        },
                        pressed && hasMore
                            ? { backgroundColor: "#333333" }
                            : undefined,
                    ]}
                    onPress={
                        hasMore
                            ? () => {
                                  navigation.navigate("ReadMoreModal", {
                                      event: item,
                                      author: user?.name || pubkey,
                                  });
                              }
                            : undefined
                    }
                >
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
                    <View
                        style={{
                            width: "100%",
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        {zaps ? (
                            <Pressable
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={[
                                        globalStyles.textBodS,
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
                                    />
                                    {" "}{zaps.amount}
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

export default ImagePost;
