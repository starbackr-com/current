import { useNavigation } from "@react-navigation/native";
import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
    withTiming,
    useAnimatedStyle,
    interpolateColor,
    useDerivedValue,
} from "react-native-reanimated";
import { useParseContent } from "../../../hooks/useParseContent";
import { getAge } from "../../shared/utils/getAge";
import UserBanner from "./UserBanner";
import { useIsZapped } from "../../zaps/hooks/useIsZapped";
import ActionBar from "./ActionBar";
import { colors, globalStyles } from "../../../styles";

const PostItem = ({ item, height, width, user, zaps }) => {
    const navigation = useNavigation();
    const [hasMore, setHasMore] = useState(false);
    const [numOfLines, setNumOfLines] = useState();
    const readMoreText = "Read More...";

    const isZapped = useIsZapped(item.id);

    const bgProgress = useDerivedValue(() => {
        return withTiming(isZapped ? 1 : 0);
    });

    const backgroundStyle = useAnimatedStyle(() => {
        const borderColor = interpolateColor(
            bgProgress.value,
            [0, 1],
            ["#222222", colors.primary500]
        );
        
        return { borderColor };
    });

    const content = useParseContent(item);

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
                        borderWidth: 1,
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
                    <Text
                        style={[
                            globalStyles.textBodyS,
                            { textAlign: "right", padding: 4, color: 'white'}
                        ]}
                    >
                        {age}
                    </Text>
                </View>
            </Animated.View>
            <ActionBar user={user} event={item} width={width}/>
        </View>
    );
};

export default PostItem;
