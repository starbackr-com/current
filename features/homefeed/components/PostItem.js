import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
    withSequence,
    withTiming,
    withRepeat,
    useAnimatedStyle,
    interpolateColor,
    useDerivedValue,
} from "react-native-reanimated";
import { useParseContent } from "../../../hooks/useParseContent";
import colors from "../../../styles/colors";
import globalStyles from "../../../styles/globalStyles";
import { getAge } from "../../shared/utils/getAge";
import { useZapNote } from "../../../hooks/useZapNote";
import UserBanner from "./UserBanner";
import { useIsZapped } from "../../zaps/hooks/useIsZapped";

const PostItem = ({ item, height, width, user, zaps }) => {
    const [isLoading, setIsLoading] = useState();
    const navigation = useNavigation();
    const [hasMore, setHasMore] = useState(false);
    const [numOfLines, setNumOfLines] = useState();
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

    const isZapped = useIsZapped(item.id);

    const bgProgress = useDerivedValue(() => {
        return withTiming(isZapped ? 1 : 0);
    });

    const backgroundStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            bgProgress.value,
            [0, 1],
            ["#222222", colors.primary500]
        );
        return { backgroundColor };
    });

    const textStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            bgProgress.value,
            [0, 1],
            ["#ffffff", colors.backgroundPrimary]
        );

        return { color };
    });

    const content = useParseContent(item);

    const zap = useZapNote(
        item.id,
        user?.lud06 || user?.lud16,
        user?.name || item?.pubkey.slice(0, 16),
        item.pubkey
    );

    const { created_at, pubkey } = item;

    const age = getAge(created_at);

    const textLayout = (e) => {
        const lineHeight = e.nativeEvent.lines[0]?.height || 16;
        const containerHeight = (((height / 100) * 90) / 100) * 90;
        const maxLines = containerHeight / lineHeight;
        const numOfLines = e.nativeEvent.lines.length;
        if (numOfLines > maxLines - 5) {
            setHasMore(true);
        } else {
            setHasMore(false);
        }
        setNumOfLines(maxLines - 5);
    };

    return (
        <View
            style={{
                height: (height / 100) * 90,
                width: width - 16,
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <Animated.View
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
                    backgroundStyle,
                ]}
            >
                <View>
                    <UserBanner
                        event={item}
                        user={user}
                        width={((width - 16) / 100) * 85}
                        isZapped={isZapped}
                    />
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
                    <Animated.Text
                        style={[
                            globalStyles.textBody,
                            {
                                textAlign: "left",
                            },
                            textStyle,
                        ]}
                        numberOfLines={numOfLines}
                    >
                        {content}
                    </Animated.Text>
                    {hasMore && (
                        <Pressable
                            onPress={() => {
                                navigation.navigate("ReadMoreModal", {
                                    event: item,
                                    author: user?.name || pubkey,
                                });
                            }}
                        >
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
                        </Pressable>
                    )}
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
                    <Animated.Text
                        style={[
                            globalStyles.textBodyS,
                            { textAlign: "right", padding: 4 },
                            textStyle
                        ]}
                    >
                        {age}
                    </Animated.Text>
                </View>
            </Animated.View>
            <View
                style={{
                    flexDirection: "column",
                    width: "10%",
                }}
            >
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
                        onPress={zap}
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
                            event: item,
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
