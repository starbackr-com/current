import { useNavigation } from "@react-navigation/native";
import { Pressable, View, Text } from "react-native";
import colors from "../../../styles/colors";
import globalStyles from "../../../styles/globalStyles";
import Ionicons from "@expo/vector-icons/Ionicons";

const getAge = (timestamp) => {
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
};

const ZapItem = ({ event, user, rootId, replies }) => {
    const navigation = useNavigation();
    console.log(event.payer);
    console.log(event.request);
    return (
        <Pressable
            style={{
                backgroundColor: colors.primary500,
                padding: 6,
                borderRadius: 6,
                marginBottom: 12,
            }}
            onPress={() => {
                navigation.push("CommentScreen", {
                    eventId: event.id,
                    rootId: rootId,
                    type: "reply",
                    nestedReplies: replies,
                });
            }}
        >
            <Text
                style={[
                    globalStyles.textBodyBold,
                    {
                        textAlign: "left",
                        width: "50%",
                        color: colors.backgroundPrimary,
                    },
                ]}
                numberOfLines={1}
                onPress={() => {
                    navigation.navigate("Profile", {
                        screen: "ProfileScreen",
                        params: { pubkey: event.payer },
                    });
                }}
            >
                {user?.name || event.payer}
            </Text>
            <Text
                style={[
                    globalStyles.textBody,
                    { textAlign: "left", color: colors.backgroundPrimary },
                ]}
            >
                Zapped: {event.amount}
                <Text
                    style={[
                        globalStyles.textBody,
                        {
                            fontFamily: "Satoshi-Symbol",
                            marginLeft: 12,
                            color: colors.backgroundPrimary,
                        },
                    ]}
                >
                    S
                </Text>
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text
                    style={[
                        globalStyles.textBodyS,
                        { color: colors.backgroundPrimary },
                    ]}
                >
                    <Ionicons name="chatbubble-outline" />
                    {replies.length}
                </Text>
                <Text
                    style={[
                        globalStyles.textBodyS,
                        {
                            textAlign: "right",
                            marginTop: 12,
                            color: colors.backgroundPrimary,
                        },
                    ]}
                >
                    {getAge(event.created_at)}
                </Text>
            </View>
        </Pressable>
    );
};

export default ZapItem;
