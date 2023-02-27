import { useNavigation } from "@react-navigation/native";
import { Text, View, Pressable } from "react-native";
import { getAge } from "../../features/shared/utils/getAge";
import { useParseContent } from "../../hooks/useParseContent";
import { useZapNote } from "../../hooks/useZapNote";
import colors from "../../styles/colors";
import globalStyles from "../../styles/globalStyles";
import PostActionBar from "./PostActionBar";

const TextPost = ({ event, user }) => {
    const content = useParseContent(event);
    const navigation = useNavigation();
    const zap = useZapNote(
        event.id,
        user?.lud06 || user?.lud16,
        user?.name || event?.pubkey.slice(0, 16)
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
        <View
            style={{
                backgroundColor: colors.backgroundSecondary,
                padding: 6,
                borderRadius: 6,
                marginBottom: 12,
            }}
        >
            <Pressable
                style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: colors.primary500,
                    borderBottomWidth: 1,
                    paddingBottom: 6,
                }}
                onPress={() => {
                    navigation.navigate("Profile", {
                        screen: "ProfileScreen",
                        params: { pubkey: event.pubkey },
                    });
                }}
            >
                <Text
                    style={[
                        globalStyles.textBodyBold,
                        { textAlign: "left", width: "50%" },
                    ]}
                    numberOfLines={1}
                >
                    {user?.name || event.pubkey}
                </Text>
                <Text style={[globalStyles.textBodyS]}>
                    {getAge(event.created_at)}
                </Text>
            </Pressable>

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
        </View>
    );
};

export default TextPost;
