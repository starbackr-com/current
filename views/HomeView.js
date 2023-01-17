import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import globalStyles from "../styles/globalStyles";
import { createStackNavigator } from "@react-navigation/stack";
import CustomButton from "../components/CustomButton";
import { decode } from "light-bolt11-decoder";
import { useNavigation } from "@react-navigation/native";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlashList } from "@shopify/flash-list";

const HomeStack = createStackNavigator();

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

    const { content, pubkey } = item;

    const { imageURL, newMessage, invoice } = parseContent(content);
    let invoiceAmount;
    if (invoice) {
        invoiceAmount = decode(invoice[0]).sections[2].value / 1000;
    }

    return (
        <View
            style={{
                height: height / 2,
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
                    maxHeight: "80%",
                    padding: 12,
                    borderRadius: 10,
                }}
            >
                <Text style={globalStyles.textBody}>{newMessage}</Text>
                {imageURL ? (
                    <Image
                        style={{ width: "100%", height: 200 }}
                        source={{ uri: imageURL[0] }}
                    />
                ) : undefined}
                {invoiceAmount ? (
                    <CustomButton
                        text={`Pay ${invoiceAmount} SATS`}
                        buttonConfig={{
                            onPress: () => {
                                navigation.navigate("Wallet", {
                                    screen: "WalletConfirmScreen",
                                    params: { invoice: invoice[0] },
                                });
                            },
                        }}
                    />
                ) : undefined}
            </View>
            <View
                style={{
                    flexDirection: "column",
                    width: "10%",
                }}
            >
                {user ? (
                    <Image
                        style={{
                            width: (width / 100) * 8,
                            height: (width / 100) * 8,
                            borderRadius: (width / 100) * 4,
                            backgroundColor: colors.primary500,
                            marginBottom: 16,
                            borderColor: colors.primary500,
                            borderWidth: 2,
                        }}
                        source={{ uri: user.picture }}
                    />
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
                        name="flash"
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

const HomeScreen = ({ navigation }) => {
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();
    const twitterModalShown = useSelector(
        (state) => state.intro.twitterModalShown
    );
    const users = useSelector((state) => state.messages.users);

    const messages = useSelector((state) => state.messages.messages);

    const onLayoutView = (e) => {
        setHeight(e.nativeEvent.layout.height);
        setWidth(e.nativeEvent.layout.width);
        if (!twitterModalShown) {
            navigation.navigate("TwitterModal");
        }
    };

    return (
        <View style={globalStyles.screenContainer} onLayout={onLayoutView}>
            {messages && height ? (
                <View style={{ flex: 1, width: "100%", height: "100%" }}>
                    <FlashList
                        data={messages}
                        renderItem={({ item }) => (
                            <PostItem
                                item={item}
                                height={height}
                                width={width}
                                user={users.find(
                                    (user) => user.pubkey === item.pubkey
                                )}
                            />
                        )}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        snapToInterval={height / 2}
                        estimatedItemSize={height / 2}
                        directionalLockEnabled
                    />
                </View>
            ) : (
                <Text>There is nothing here...</Text>
            )}
        </View>
    );
};

const HomeView = () => {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
        </HomeStack.Navigator>
    );
};

export default HomeView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#18181b",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },

    createKeyText: {
        color: "white",
        textAlign: "center",
        margin: 12,
    },
});
