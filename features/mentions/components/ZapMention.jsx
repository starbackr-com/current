import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { colors, globalStyles } from "../../../styles";

const ZapMention = ({ item }) => {
    const user = useSelector((state) => state.messages.users[item.payer]);
    const navigation = useNavigation();
    return (
        <Pressable
            style={{ flexDirection: "row", width: "100%", padding: 6 }}
            onPress={() => {
                navigation.navigate("Profile", {
                    screen: "ProfileScreen",
                    params: {
                        pubkey: item.payer,
                    },
                });
            }}
        >
            <Image
                source={
                    user?.picture ||
                    require("../../../assets/user_placeholder.jpg")
                }
                recyclingKey={item.payer}
                style={{ height: 50, width: 50, borderRadius: 25 }}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                    style={[globalStyles.textBodyBold, { textAlign: "left" }]}
                >
                    {user?.name || item.pubkey.slice(0, 16)}
                </Text>
                <View>
                    <Text
                        style={[globalStyles.textBody, { textAlign: "left" }]}
                        numberOfLines={6}
                    >
                        zapped you!{" "}
                        <Text style={{ color: colors.primary500 }}>
                            {item.amount} SATS
                        </Text>
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default ZapMention;
