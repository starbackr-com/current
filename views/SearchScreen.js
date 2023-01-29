import { View, Text } from "react-native";
import React, { useState } from "react";
import globalStyles from "../styles/globalStyles";
import { FlashList } from "@shopify/flash-list";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../components/CustomButton";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../styles/colors";
import { followPubkey, unfollowPubkey } from "../features/userSlice";
import Input from "../components/Input";
import { decodePubkey } from "../utils/nostr/keys";
import { getUserData, updateUsers } from "../utils/nostr/getNotes";
import { followUser, unfollowUser } from "../utils/users";

const UserItem = ({ item, user }) => {
    const deleteHandler = () => {
        unfollowUser(item)
    };
    return (
        <View>
            <Text style={globalStyles.textBody}>{user?.name || item}</Text>
            <Pressable onPress={deleteHandler}>
                <Ionicons
                    name="close-circle-outline"
                    size={32}
                    color={colors.primary500}
                />
            </Pressable>
        </View>
    );
};

const SearchScreen = () => {
    const [input, setInput] = useState("");
    const dispatch = useDispatch();
    const following = useSelector((state) => state.user.followedPubkeys);
    const users = useSelector((state) => state.messages.users);

    const searchHandler = async () => {
        if (input.includes("npub")) {
            const decoded = await decodePubkey(input);
            console.log(decoded);
            await followUser(decoded);
            return;
        }

        // updateUsers();
    };
    return (
        <View style={globalStyles.screenContainer}>
            <View
                style={{
                    flexDirection: "row",
                    width: "80%",
                    justifyContent: "center",
                }}
            >
                <Input textInputConfig={{ onChangeText: setInput }} />
                <CustomButton
                    icon="add"
                    buttonConfig={{ onPress: searchHandler }}
                />
            </View>
            <View style={{ flex: 6, width: "100%" }}>
                <View style={{ flex: 1, width: "100%", height: "100%" }}>
                    <FlashList
                        data={following}
                        renderItem={({ item }) => (
                            <UserItem item={item} user={users[item]} />
                        )}
                        estimatedItemSize={50}
                        extraData={users}
                    />
                </View>
            </View>
        </View>
    );
};

export default SearchScreen;
