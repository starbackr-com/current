import { View, Text } from "react-native";
import React, { useState } from "react";
import globalStyles from "../styles/globalStyles";
import { FlashList } from "@shopify/flash-list";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../components/CustomButton";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../styles/colors";
import Input from "../components/Input";
import { decodePubkey } from "../utils/nostr/keys";
import { followUser, unfollowUser } from "../utils/users";
import { updateFollowedUsers } from "../utils/nostrV2/getUserData";

const UserItem = ({ item, user }) => {
    const deleteHandler = () => {
        unfollowUser(item)
        
    };
    return (
        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', backgroundColor: '#222222', padding: 6, borderRadius: 10, alignItems: 'center', marginBottom: 6}}>
            <Text style={[globalStyles.textBody, {overflow: 'hidden'}]}>{user?.name || item}</Text>
                <CustomButton text='Unfollow' buttonConfig={{onPress: deleteHandler}}/>
        </View>
    );
};

const SearchScreen = () => {
    const [input, setInput] = useState("");
    const following = useSelector((state) => state.user.followedPubkeys);
    const users = useSelector((state) => state.messages.users);
    const searchHandler = async () => {
        if (input.includes("npub")) {
            const decoded = await decodePubkey(input);
            await followUser(decoded);
            await updateFollowedUsers();
            return;
        }
    };
    return (
        <View style={[globalStyles.screenContainer, {justifyContent: 'space-between'}]}>
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
