import { View, Text } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import { useEffect } from "react";
import { useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { getReplies } from "../../utils/nostrV2/getReplies";
import colors from "../../styles/colors";
import { useSelector } from "react-redux";
import { getUserData } from "../../utils/nostrV2/getUserData";
import LoadingSpinner from "../../components/LoadingSpinner";
import Input from "../../components/Input";
import Ionicons from "@expo/vector-icons/Ionicons";

const ReplyItem = ({ event, user }) => {
    return (
        <View
            style={{
                backgroundColor: colors.backgroundSecondary,
                padding: 6,
                borderRadius: 6,
                marginBottom: 12,
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
            <Text style={[globalStyles.textBody, { textAlign: "left" }]}>
                {event.content}
            </Text>
        </View>
    );
};

const CommentScreen = ({ route }) => {
    const { eventId } = route?.params;
    const [replies, setReplies] = useState();

    const users = useSelector((state) => state.messages.users);

    const getAllReplies = async () => {
        const response = await getReplies(eventId);
        const pubkeys = Object.keys(response).map(
            (key) => response[key].pubkey
        );
        const array = Object.keys(response).map((key) => response[key]);

        setReplies(array);
        getUserData(pubkeys);
    };
    useEffect(() => {
        getAllReplies();
    }, []);
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Comments</Text>
            <View
                style={{
                    flex: 2,
                    width: "100%",
                    borderColor: colors.backgroundSecondary,
                    borderWidth: 1,
                    padding: 6,
                    borderRadius: 10,
                }}
            >
                {replies ? (
                    <FlashList
                        data={replies}
                        renderItem={({ item }) => (
                            <ReplyItem event={item} user={users[item.pubkey]} />
                        )}
                        estimatedItemSize={80}
                        extraData={users}
                    />
                ) : (
                    <View
                        style={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <LoadingSpinner size={32} />
                    </View>
                )}
            </View>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "80%",
                    }}
                >
                    <Input />
                    <Ionicons name="send" size={32} color={colors.primary500} />
                </View>
            </View>
        </View>
    );
};

export default CommentScreen;
