import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import globalStyles from "../styles/globalStyles";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "../components/CustomButton";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { getUserData } from "../utils/nostrV2";
import { encodePubkey } from "../utils/nostr/keys";
import * as Clipboard from "expo-clipboard";
import { useSelector } from "react-redux";
import ImagePost from "../components/Posts/ImagePost";
import TextPost from "../components/Posts/TextPost";
import BackButton from "../components/BackButton";
import {
    useFollowUser,
    useGetBadges,
    useSubscribePosts,
    useUnfollowUser,
    usePaginatedPosts
} from "../hooks";

const ProfileHeader = ({ pubkey, user, loggedInPubkey }) => {
    const [copied, setCopied] = useState();
    const [verified, setVerified] = useState(false);
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
    const { unfollow } = useUnfollowUser();
    const { follow } = useFollowUser();

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

    const copyHandler = async () => {
        await Clipboard.setStringAsync(npub);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const npub = encodePubkey(pubkey) || "npub100000000000000000";
    return (
        <View style={{ width: "100%" }}>
            <View style={{ width: "100%", height: 20 }}></View>
            <View style={{ padding: 12, width: "100%" }}>
                <View
                    style={{
                        width: "100%",
                        alignItems: "center",
                        flexDirection: "row",
                        marginBottom: 12,
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
                    <View style={{ padding: 12 }}>
                        {pubkey === loggedInPubkey ? (
                            <Text
                                style={[
                                    globalStyles.textBodyS,
                                    {
                                        color: colors.primary500,
                                        textAlign: "left",
                                    },
                                ]}
                                onPress={() => {}}
                            >{`${followedPubkeys.length} following`}</Text>
                        ) : undefined}
                        <Text
                            style={[
                                globalStyles.textBody,
                                { color: colors.primary500, textAlign: "left" },
                            ]}
                        >
                            {user?.nip05}{" "}
                            <Ionicons
                                name={verified ? "checkbox" : "close-circle"}
                            />{" "}
                        </Text>
                        <Text
                            style={[
                                globalStyles.textBody,
                                { color: colors.primary500, textAlign: "left" },
                            ]}
                        >
                            {user?.lud16}{" "}
                            <Ionicons name={user?.lud16 ? "flash" : ""} />{" "}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text
                        style={[globalStyles.textBody, { textAlign: "left" }]}
                    >
                        {user?.about}
                    </Text>
                    <Text
                        style={[
                            globalStyles.textBodyS,
                            {
                                textAlign: "left",
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
                                        follow([pubkey]);
                                    },
                                }}
                            />
                        ) : (
                            <CustomButton
                                text="Unfollow"
                                buttonConfig={{
                                    onPress: () => {
                                        unfollow(pubkey);
                                    },
                                }}
                            />
                        )
                    ) : undefined}
                </View>
            </View>
        </View>
    );
};

const ProfileScreen = ({ route, navigation }) => {
    const { pubkey } = route.params;
    const [feed, setFeed] = useState();
    const users = useSelector((state) => state.messages.users);
    const [width, setWidth] = useState();

    const listRef = useRef();

    const loggedInPubkey = useSelector((state) => state.auth.pubKey);

    const now = new Date() / 1000;

    // const [data, page, setPage] = useSubscribePosts([pubkey], now);

    const [get25Posts, events, isLoading] = usePaginatedPosts([pubkey])

    const user = users[pubkey];

    const onLayoutViewWidth = (e) => {
        setWidth(e.nativeEvent.layout.width);
    };

    const renderItem = ({ item }) => {
        if (item.type === "image") {
            return <ImagePost event={item} user={user} width={width} />;
        } else if (item.type === "text") {
            return <TextPost event={item} user={user} width={width} />;
        }
    };

    return (
        <View
            style={[
                globalStyles.screenContainer,
                { paddingTop: 0, paddingHorizontal: 0 },
            ]}
        >
            <View
                style={{
                    flex: 1,
                    width: "100%",
                }}
                onLayout={onLayoutViewWidth}
            >
                <FlashList
                    data={events}
                    renderItem={renderItem}
                    ListHeaderComponent={
                        <ProfileHeader
                            user={user}
                            pubkey={pubkey}
                            loggedInPubkey={loggedInPubkey}
                        />
                    }
                    extraData={users}
                    ListFooterComponent={
                        <CustomButton
                            text="Load more"
                            buttonConfig={{
                                onPress: get25Posts,
                            }}
                            disabled={isLoading}
                            loading={isLoading}
                        />
                    }
                    estimatedItemSize={250}
                    ItemSeparatorComponent={() => (
                        <View
                            style={{
                                height: 1,
                                backgroundColor: colors.backgroundSecondary,
                                width: "100%",
                                marginVertical: 5,
                            }}
                        />
                    )}
                    ref={listRef}
                    keyExtractor={(item) => item.id}
                />
                <View style={{ height: 36 }}></View>
            </View>
        </View>
    );
};

export default ProfileScreen;
