import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { getAge } from "../../features/shared/utils/getAge";
import colors from "../../styles/colors";

export const ZapPost = ({ event, user }) => {
    const navigation = useNavigation();
    return (
        <Animated.View
            entering={FadeIn}
            style={{
                padding: 6,
                marginBottom: 12,
                backgroundColor: colors.primary500,
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
                            params: {
                                pubkey: event.payer,
                                name: user.name || event.payer,
                            },
                        });
                    }}
                >
                    {user?.name || event.pubkey}
                </Text>
                <Text
                    style={[
                        globalStyles.textBodyS,
                        { color: colors.backgroundPrimary },
                    ]}
                >
                    {getAge(event.created_at)}
                </Text>
            </View>

            <Text
                style={[
                    globalStyles.textBody,
                    {
                        textAlign: "left",
                        marginTop: 16,
                        color: colors.backgroundPrimary,
                    },
                ]}
            >
                Zapped {event.amount} SATS
            </Text>
        </Animated.View>
    );
};
