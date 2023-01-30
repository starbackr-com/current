import { View, Text } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import { useEffect } from "react";
import { useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { getReplies } from "../../utils/nostrV2/getReplies";

const CommentScreen = ({ route }) => {
    const { eventId } = route?.params;
    const [replies, setReplies] = useState();

    const getAllReplies = async () => {
        const response = await getReplies(eventId);
        const array = Object.keys(response).map((key) => response[key]);
        setReplies(array)
    };
    useEffect(() => {
        getAllReplies();
    }, []);
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Comments</Text>
            <View style={{ flex: 2, width: "100%" }}>
                {replies ? (
                    <FlashList
                        data={replies}
                        renderItem={({ item }) => (
                            <Text style={globalStyles.textBody}>
                                {item.content}
                            </Text>
                        )}
                    />
                ) : (
                    <Text>No Replies yet...</Text>
                )}
            </View>
            <View style={{ flex: 1 }}>
                <Text>Put Comment here</Text>
            </View>
        </View>
    );
};

export default CommentScreen;
