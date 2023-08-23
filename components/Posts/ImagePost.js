import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import * as Haptics from 'expo-haptics';
import { getAge } from "../../features/shared/utils/getAge";
import { useParseContent } from "../../hooks/useParseContent";
import { useZapNote } from "../../hooks/useZapNote";
import globalStyles from "../../styles/globalStyles";
import FeedImage from "../Images/FeedImage";
import PostActionBar from "./PostActionBar";
import { useDispatch } from "react-redux";
import useInteractions from "../../hooks/useInteractions";
import { useCallback } from "react";
import { addLike, removeLike } from "../../features/interactionSlice";
import { publishReaction } from "../../utils/nostrV2";

export const ImagePost = ({ event, user, width, onMenu }) => {
    const content = useParseContent(event);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {isLiked} = useInteractions(event.id)

    const zap = useZapNote(
        event.id,
        user?.lud16 || user?.lud06,
        user?.name || event?.pubkey.slice(0, 16),
        event.pubkey
    );

    const likeHandler = useCallback(async () => {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          dispatch(addLike([event.id]));
          await publishReaction('+', event.id, event.pubkey);
        } catch (e) {
          dispatch(removeLike(event.id));
          console.log(e);
        }
      }, [dispatch, event]);

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
                    marginBottom: 16,
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
            <FeedImage size={width} images={event.image} />
            <View style={{ padding: 6 }}>
                <Text style={[globalStyles.textBody, { textAlign: "left" }]}>
                    {content}
                </Text>
                <PostActionBar
                    onPressComment={commentHandler}
                    onPressZap={zapHandler}
                    onPressMore={() => {onMenu(event)}}
                    zapDisabled={!user?.lud06 && !user?.lud16}
                    onPressLike={likeHandler}
                    isLiked={isLiked}
                />
            </View>
        </Animated.View>
    );
};
