import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "../styles/globalStyles";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "../components/CustomButton";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { getUserData, getUsersPosts } from "../utils/nostrV2";
import { encodePubkey } from "../utils/nostr/keys";
import * as Clipboard from "expo-clipboard";
import { useSelector } from "react-redux";
import { followUser } from "../utils/users";

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
    const { pubkey } = route.params;
    const [feed, setFeed] = useState();
    const [copied, setCopied] = useState();
    const [verified, setVerified] = useState(false);

    const loggedInPubkey = useSelector((state) => state.auth.pubKey);
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
    const users = useSelector((state) => state.messages.users);

    const user = users[pubkey];

    const verifyNip05 = async (pubkey, nip05) => {
        try {
            const [name, domain] = nip05.split("@");
            const response = await fetch(
                `https://${domain}/.well-known/nostr.json?name=${name}`
            );
            const data = await response.json();
            if (Object.values(data.names).includes(pubkey)) {
                setVerified(true);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getUserData([pubkey]);
        if (user && user?.nip05) {
            verifyNip05(user.pubkey, user.nip05);
        }
    }, []);

    const getFeed = async () => {
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
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const npub = encodePubkey(pubkey);

    return (
        <View
            style={[
                globalStyles.screenContainer,
                {
                    paddingHorizontal: 0,
                    paddingTop: 0,
                    alignItems: "center",
                },
            ]}
        >
            <View style={{ width: "100%", height: "10%" }} />
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
            <View style={{ width: "100%", alignItems: "center" }}>
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
                <View style={{ padding: 12 }}>
                    <Text style={[globalStyles.textBodyBold]}>
                        {user?.name || pubkey}
                    </Text>
                    {pubkey === loggedInPubkey ? (
                        <Text
                            style={[
                                globalStyles.textBodyS,
                                { color: colors.primary500 },
                            ]}
                            onPress={() => {}}
                        >{`${followedPubkeys.length} following`}</Text>
                    ) : undefined}
                    <Text
                        style={[
                            globalStyles.textBody,
                            { color: colors.primary500 },
                        ]}
                    >
                        {user?.nip05}
                        <Ionicons
                            name={verified ? "checkbox" : "close-circle"}
                        />{" "}
                    </Text>
                    <Text style={[globalStyles.textBody]}>{user?.about}</Text>
                    <Text
                        style={[
                            globalStyles.textBodyS,
                            {
                                textAlign: "center",
                                color: "grey",
                                marginBottom: 24,
                            },
                            copied ? { color: colors.primary500 } : undefined,
                        ]}
                        onPress={copyHandler}
                    >
                        {`${npub.slice(0, 32)}...`}
                        <Ionicons name="clipboard" />
                    </Text>
                    {loggedInPubkey !== pubkey ? (
                        !followedPubkeys.includes(pubkey) ? (
                            <CustomButton
                                text="Follow"
                                buttonConfig={{
                                    onPress: () => {
                                        followUser(pubkey);
                                    },
                                }}
                            />
                        ) : (
                            <CustomButton text="Unfollow" />
                        )
                    ) : undefined}
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
                    <View style={{ flex: 1, width: "94%" }}>
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
            {pubkey === loggedInPubkey ? (
                <View style={{ position: "absolute", right: 32, top: 32 }}>
                    <Text
                        style={[
                            globalStyles.textBodyS,
                            { color: colors.primary500 },
                        ]}
                        onPress={() => {
                            navigation.navigate("EditProfileScreen");
                        }}
                    >
                        Edit Profile
                    </Text>
                </View>
            ) : undefined}
        </View>
    );
};

export default ProfileScreen;
