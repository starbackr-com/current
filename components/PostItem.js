import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, Pressable } from "react-native";
import CustomButton from "../components/CustomButton";
import { decode } from "light-bolt11-decoder";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const PostItem = ({ item, height, width, user }) => {
    const navigation = useNavigation();
    const parseContent = (message) => {
        let imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        let imageURL = message.match(imageRegex);
        let invoiceRegex = /(lnbc\d+[munp][A-Za-z0-9]+)/g;
        let invoice = message.match(invoiceRegex);
        let newMessage = message
            .replace(imageRegex, function (url) {
                return "";
            })
            .replace(invoiceRegex, function (url) {
                return "";
            });
        return { imageURL, newMessage, invoice };
    };

    const getAge = (timestamp) => {
        const now = new Date();
        const timePassedInMins = Math.floor(
            (now - new Date(timestamp * 1000)) / 1000 / 60
        );

        if (timePassedInMins < 60) {
            return "< 1h ago";
        } else if (timePassedInMins >= 60 && timePassedInMins < 1440) {
            return `${Math.floor(timePassedInMins / 60)}h ago`;
        } else if (timePassedInMins >= 1440 && timePassedInMins < 10080) {
            return `${Math.floor(timePassedInMins / 1440)}d ago`;
        } else {
            return `on ${new Date(timestamp * 1000).toLocaleDateString()}`;
        }
    };

    const { content, created_at } = item;

    const { imageURL, newMessage, invoice } = parseContent(content);

    let invoiceAmount;
    if (invoice) {
        invoiceAmount = decode(invoice[0]).sections[2].value / 1000;
    }

    const tipHandler = () => {
        const dest = user.lud06.toLowerCase();
        if (dest.includes("lnurl")) {
            navigation.navigate("Wallet", {
                screen: "WalletSendLnurlScreen",
                params: { lnurl: dest },
            });
            return
        }
        if (dest.includes("@")) {
            navigation.navigate("Wallet", {
                screen: "WalletSendLnurlScreen",
                params: { address: dest },
            });
            return
        }
        alert('Unknown Tip-Format')
    };

    const age = getAge(created_at);

    return (
        <View
            style={{
                height: (height / 100) * 80,
                width: width - 32,
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    backgroundColor: "#222222",
                    marginBottom: 16,
                    width: "85%",
                    height: "80%",
                    padding: 12,
                    borderRadius: 10,
                    justifyContent: "space-between",
                    overflow: "hidden",
                }}
            >
                <View style={{ maxHeight: "65%", overflow: "hidden" }}>
                    <Text
                        style={[
                            globalStyles.textBodyBold,
                            { textAlign: "left" },
                        ]}
                    >
                        {user.name}
                    </Text>
                    <Text
                        style={[globalStyles.textBody, { textAlign: "left" }]}
                    >
                        {newMessage}
                    </Text>
                </View>

                {imageURL ? (
                    <Image
                        style={{
                            width: "100%",
                            height: "30%",
                            borderRadius: 10,
                            marginTop: 16,
                        }}
                        source={{ uri: imageURL }}
                    />
                ) : undefined}
                <Text
                    style={[
                        globalStyles.textBody,
                        { textAlign: "right", padding: 4 },
                    ]}
                >
                    {age}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: "column",
                    width: "10%",
                }}
            >
                <View
                    style={{
                        width: (width / 100) * 8,
                        height: (width / 100) * 8,
                        borderRadius: (width / 100) * 4,
                        backgroundColor: colors.primary500,
                        marginBottom: 16,
                    }}
                >
                    {user ? (
                        <Image
                            style={{
                                width: (width / 100) * 8,
                                height: (width / 100) * 8,
                                borderRadius: (width / 100) * 4,
                                backgroundColor: colors.primary500,
                                borderColor: colors.primary500,
                                borderWidth: 2,
                            }}
                            source={{ uri: user.picture }}
                        />
                    ) : undefined}
                </View>
                {user?.lud06 ? (
                    <Pressable
                        style={{
                            width: (width / 100) * 8,
                            height: (width / 100) * 8,
                            borderRadius: (width / 100) * 4,
                            backgroundColor: colors.primary500,
                            marginBottom: 16,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={tipHandler}
                    >
                        <Ionicons
                            name="flash"
                            color="white"
                            size={(width / 100) * 5}
                        />
                    </Pressable>
                ) : undefined}
                <View
                    style={{
                        width: (width / 100) * 8,
                        height: (width / 100) * 8,
                        borderRadius: (width / 100) * 4,
                        backgroundColor: colors.primary500,
                        marginBottom: 16,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Ionicons
                        name="chatbubble-ellipses"
                        color="white"
                        size={(width / 100) * 5}
                    />
                </View>
                <View
                    style={{
                        width: (width / 100) * 8,
                        height: (width / 100) * 8,
                        borderRadius: (width / 100) * 4,
                        backgroundColor: colors.primary500,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Ionicons
                        name="ellipsis-horizontal"
                        color="white"
                        size={(width / 100) * 5}
                    />
                </View>
            </View>
        </View>
    );
};

export default PostItem;
