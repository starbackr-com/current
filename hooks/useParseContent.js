import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import reactStringReplace from "react-string-replace";
import * as Linking from "expo-linking";

export const useParseContent = (event) => {
    const navigation = useNavigation();
    const users = useSelector(state => state.messages.users)
    let content = event.content
    content = reactStringReplace(content, /#\[([0-9]+)]/, (m, i) => {
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
                @{users[event.mentions[i - 1]?.mention]?.name || [event.mentions[i - 1]?.mention]}
            </Text>
        );
    });

    content = reactStringReplace(
        content,
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
        (m, i) => {
            return (
                <Text
                    style={{ color: colors.primary500 }}
                    onPress={() => {
                        Linking.openURL(m);
                    }}
                    key={m}
                >
                    {m}
                </Text>
            );
        }
    );
    return content;
};