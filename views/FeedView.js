import { View, Text, FlatList } from "react-native";
import React from "react";
import { useGetMessagesQuery } from "../services/messagesApi";

const FeedView = () => {
    const { data, error, isLoading } = useGetMessagesQuery();
    let content;
    if (data) {
        content = data.filter(event => event.some(e => {
            return e === 'EVENT'
        })).map(item => item[2].content);
        console.log(content)
    }

    return (
        <View>
            {data ? (
                <FlatList
                    data={content}
                    renderItem={({item}) => (
                        <Text>{item}</Text>
                    )}
                />
            ) : undefined}
        </View>
    );
};

export default FeedView;

[["EVENT", "008584865584873676", {"content": "Yes it does @foxyzombies", "created_at": 1672905202, "id": "1a295333de072b0510dd1bedfb292b54c4840bddfafbc7a74c98c6daf96a1a55", "kind": 1, "pubkey": "02547d2ac238e94776af95cf03343d31f007a7306e909462522fff0f5c13724c", "sig": "c3f11f68ba863e8c136363a331d95bbd17bb237124f980762fbe296ea8a69b8ff9f3f559312498caa3e9d314017c877700f0c0b5eb89f0f63715c2fb99addfe0", "tags": [Array]}], ["EOSE", "008584865584873676"]]