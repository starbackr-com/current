import { View, Text, Pressable } from "react-native";
import React from "react";
import globalStyles from "../../../styles/globalStyles";
import { FlashList } from "@shopify/flash-list";
import { useNoteMentions } from "../hooks/useNoteMentions";
import { Image } from "expo-image";
import colors from "../../../styles/colors";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../../../components/BackButton";

const lorem =
    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

const Mention = ({ item }) => {
    const user = useSelector((state) => state.messages.users[item.pubkey]);
    const pTags = item.tags.filter((tag) => tag[0] === "p");
    const navigation = useNavigation();
    return (
        <Pressable
            style={{ flexDirection: "row", width: "100%", padding: 6 }}
            onPress={() => {
                navigation.navigate("CommentScreen", {
                    eventId: item.id,
                    rootId: item.id,
                    type: "root",
                });
            }}
        >
            <Image
                source={
                    user?.picture ||
                    require("../../../assets/user_placeholder.jpg")
                }
                style={{ height: 50, width: 50, borderRadius: 25 }}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                    style={[globalStyles.textBodyBold, { textAlign: "left" }]}
                >
                    {user?.name || item.pubkey.slice(0, 16)}
                </Text>
                <Text
                    style={[
                        globalStyles.textBodyS,
                        { color: colors.primary500, textAlign: "left" },
                    ]}
                >
                    {`Reply to you and ${pTags.length - 1} others...`}
                </Text>
                <View>
                    <Text
                        style={[globalStyles.textBody, { textAlign: "left" }]}
                        numberOfLines={6}
                    >
                        {item.content}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

const MentionsModal = ({ navigation }) => {
    const data = useNoteMentions();
    const renderItem = ({ item }) => {
        return <Mention item={item} />;
    };

    return (
        <View style={globalStyles.screenContainer}>
            <View style={{ width: "100%" }}>
                <BackButton
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
            </View>
            <View style={{ flex: 1, width: "100%" }}>
                <FlashList
                    data={data}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 10 }} />
                    )}
                    estimatedItemSize={100}
                />
            </View>
        </View>
    );
};

export default MentionsModal;
