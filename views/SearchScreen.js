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
import { bech32 } from "bech32";
import { decodePubkey } from "../utils/nostr/keys";
import { db, getUsersFromDb, hydrateFromDatabase } from "../utils/database";
import { getUserData, updateUsers } from "../utils/nostr/getNotes";
import LoadingSpinner from "../components/LoadingSpinner";

const UserItem = ({ item }) => {
    const dispatch = useDispatch();
    const deleteHandler = () => {
        dispatch(unfollowPubkey(item.pubkey));
    };
    return (
        <View>
            <Text>{item.name || item.pubkey}</Text>
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

    const searchHandler = async () => {
        if (input.includes("npub")) {
            const decoded = decodePubkey(input);
            await getUserData(decoded);
            dispatch(followPubkey(decoded));
            return;
        }

        updateUsers();
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
            <View style={{ flex: 6, width: '100%' }}>
                <View style={{ flex: 1, width: "100%", height: "100%" }}>
                    <FlashList
                        data={following}
                        renderItem={({ item }) => <Text style={globalStyles.textBody}>{item}</Text>}
                        estimatedItemSize={50}
                    />
                </View>
            </View>
        </View>
    );
};

export default SearchScreen;
