import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";
import Animated, { FadeIn, LightSpeedInLeft } from "react-native-reanimated";
import { getAge } from "../../features/shared/utils/getAge";
import { useParseContent } from "../../hooks/useParseContent";
import { useZapNote } from "../../hooks/useZapNote";
import PostActionBar from "./PostActionBar";

const TextPost = ({ event, user }) => {
    const content = useParseContent(event);
    const navigation = useNavigation();
    const zap = useZapNote(
        event.id,
        user?.lud06 || user?.lud16,
        user?.name || event?.pubkey.slice(0, 16),
        event.pubkey
    );
    const commentHandler = () => {
        navigation.push("CommentScreen", {
            eventId: event.id,
            rootId: event.id,
            type: "root",
            event: event,
        });
    };

    const zapHandler = () => {
        zap();
    };

    const moreHandler = () => {
        navigation.navigate("PostMenuModal", { event });
    };
    return (
        <Animated.View
            entering={FadeIn}
            style={{
                padding: 6,
                marginBottom: 12,
            }}
        >
            <View
                style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Text
                    style={[
                        globalStyles.textBodyBold,
                        { textAlign: "left", width: "50%" },
                    ]}
                    numberOfLines={1}
                    onPress={() => {
                        navigation.navigate("Profile", {
                            screen: "ProfileScreen",
                            params: { pubkey: event.pubkey },
                        });
                    }}
                >
                    {user?.name || event.pubkey}
                </Text>
                <Text style={[globalStyles.textBodyS]}>
                    {getAge(event.created_at)}
                </Text>
            </View>

            <Text
                style={[
                    globalStyles.textBody,
                    { textAlign: "left", marginTop: 16 },
                ]}
            >
                {content}
            </Text>
            <PostActionBar
                onPressComment={commentHandler}
                onPressZap={zapHandler}
                onPressMore={moreHandler}
                zapDisabled={!user?.lud06 && !user?.lud16}
            />
        </Animated.View>
    );
};

export default TextPost;
