import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import Animated, { FadeIn, LightSpeedInLeft } from "react-native-reanimated";
import { getAge } from "../../features/shared/utils/getAge";
import { useParseContent } from "../../hooks/useParseContent";
import { useZapNote } from "../../hooks/useZapNote";
import globalStyles from "../../styles/globalStyles";
import FeedImage from "../Images/FeedImage";
import PostActionBar from "./PostActionBar";

const ImagePost = ({ event, user, width }) => {
    const content = useParseContent(event);
    const navigation = useNavigation();

    const zap = useZapNote(
        event.id,
        user?.lud06 || user?.lud16,
        user?.name || event?.pubkey.slice(0, 16)
    );

    const commentHandler = () => {
        navigation.navigate("CommentScreen", {
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
                marginBottom: 12,
            }}
        >
            <View
                style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 16
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
            {/* <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    paddingBottom: 6,
                    marginBottom: 6,
                    paddingHorizontal: 6,
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
                <Text
                    style={[
                        globalStyles.textBodyS,
                        { textAlign: "right", marginTop: 12 },
                    ]}
                >
                    {getAge(event.created_at)}
                </Text>
            </View> */}
            <FeedImage size={width} images={event.image} />
            <View style={{ padding: 6 }}>
                <Text style={[globalStyles.textBody, { textAlign: "left" }]}>
                    {content}
                </Text>
                <PostActionBar
                    onPressComment={commentHandler}
                    onPressZap={zapHandler}
                    onPressMore={moreHandler}
                    zapDisabled={!user?.lud06 && !user?.lud16}
                />
            </View>
        </Animated.View>
    );
};

export default ImagePost;
