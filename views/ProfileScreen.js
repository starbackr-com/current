import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "../styles/globalStyles";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "../components/CustomButton";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { getUsersPosts } from "../utils/nostrV2";
import { encodePubkey } from "../utils/nostr/keys";
import * as Clipboard from 'expo-clipboard';
import { useSelector } from "react-redux";

const getAge = (timestamp) => {
    const now = new Date();
    const timePassedInMins = Math.floor(
        (now - new Date(timestamp * 1000)) / 1000 / 60
    );

    if (timePassedInMins < 60) {
        return `${timePassedInMins}min ago`;
    } else if (timePassedInMins >= 60 && timePassedInMins < 1440) {
        return `${Math.floor(timePassedInMins / 60)}h ago`;
    } else if (timePassedInMins >= 1440 && timePassedInMins < 10080) {
        return `${Math.floor(timePassedInMins / 1440)}d ago`;
    } else {
        return `on ${new Date(timestamp * 1000).toLocaleDateString()}`;
    }
};

const PostItem = ({ event, user }) => {
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
            <Text
                style={[
                    globalStyles.textBodyS,
                    { textAlign: "right", marginTop: 12 },
                ]}
            >
                {getAge(event.created_at)}
            </Text>
        </View>
    );
};

const ProfileScreen = ({ route, navigation }) => {
    const { user } = route.params;
    const [feed, setFeed] = useState();
    const [copied, setCopied] = useState();

    const followedPubkeys = useSelector(state => state.user.followedPubkeys)

    const getFeed = async () => {
        console.log(user.pubkey);
        const response = await getUsersPosts(user.pubkey);
        const array = Object.keys(response)
            .map((key) => response[key])
            .sort((a, b) => {
                return a.created_at < b.created_at ? 1 : -1;
            });
        setFeed(array);
    };

    const copyHandler = async () => {
        await Clipboard.setStringAsync(npub);
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    };

    const npub = encodePubkey(user?.pubkey);

    return (
        <View
            style={[
                globalStyles.screenContainer,
                {
                    paddingHorizontal: 0,
                    paddingTop: 0,
                },
            ]}
        >
            <View
                style={{ width: "100%", height: "10%" }}
            />
            <Pressable
                style={{
                    position: "absolute",
                    top: 16,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                }}
                onPress={() => {
                    navigation.goBack();
                }}
            >
                <Ionicons
                    name="chevron-down"
                    size={32}
                    color={colors.primary500}
                />
            </Pressable>
            <View style={{ alignItems: "flex-start", width: "100%" }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: 12,
                    }}
                >
                    <Image
                        style={{
                            width: 74,
                            height: 74,
                            borderRadius: 37,
                            borderColor: colors.primary500,
                            borderWidth: 1,
                        }}
                        source={
                            user?.picture ||
                            require("../assets/user_placeholder.jpg")
                        }
                    />
                </View>
                <View style={{ padding: 12 }}>
                    <Text
                        style={[
                            globalStyles.textBodyBold,
                            { textAlign: "left" },
                        ]}
                    >
                        {user?.name}
                    </Text>
                    <Text
                        style={[globalStyles.textBody, { textAlign: "left" }]}
                    >
                        {user?.about}
                    </Text>
                    <Text
                        style={[globalStyles.textBodyS, { textAlign: "left", color: 'grey'}, copied ? {color: colors.primary500} : undefined]} onPress={copyHandler}
                    >
                        {`${npub.slice(0, 32)}...`}<Ionicons name='clipboard'/>
                    </Text>
                    {/* {!followedPubkeys.includes(user.pubkey) ? <CustomButton text='Follow'/> : <CustomButton text='Unfollow'/>} */}
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {feed ? (
                    <View style={{flex: 1, width: '94%'}}>
                        <FlashList
                            data={feed}
                            renderItem={({ item }) => (
                                <PostItem event={item} user={user} />
                            )}
                        />
                    </View>
                ) : (
                    <View style={{ width: "50%" }}>
                        <CustomButton
                            text="Load Feed"
                            buttonConfig={{ onPress: getFeed }}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

export default ProfileScreen;
