import { Text, View } from "react-native";
import { getAge } from "../../features/shared/utils/getAge";
import { useParseContent } from "../../hooks/useParseContent";
import globalStyles from "../../styles/globalStyles";
import FeedImage from "../Images/FeedImage";
import PostActionBar from "./PostActionBar";

const ImagePost = ({ event, user, width }) => {
    const content = useParseContent(event);
    return (
        <View
            style={{
                backgroundColor: colors.backgroundSecondary,
                padding: 6,
                borderRadius: 6,
                marginBottom: 12,
            }}
        >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width:'100%', alignItems: 'center'}}>
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
            </View>
            <FeedImage size={width} images={event.image} />
            <Text style={[globalStyles.textBody, { textAlign: "left" }]}>
                {content}
            </Text>
            <PostActionBar/>
        </View>
    );
};

export default ImagePost;
