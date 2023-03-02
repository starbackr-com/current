import { View, Text, Pressable, ScrollView } from "react-native";
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
import { followUser } from "../utils/users";
import ImagePost from "../components/Posts/ImagePost";
import { useSubscribePosts } from "../hooks/useSubscribePosts";
import TextPost from "../components/Posts/TextPost";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../components/BackButton";

const ProfileHeader = ({ pubkey, user, loggedInPubkey }) => {
    const [copied, setCopied] = useState();
    const [verified, setVerified] = useState(false);
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);

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

    const npub = encodePubkey(pubkey);
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
                        <Text
                            style={[
                                globalStyles.textBodyBold,
                                { textAlign: "left" },
                            ]}
                        >
                            {user?.name || pubkey}
                        </Text>
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

    const [data, page, setPage] = useSubscribePosts([pubkey], now);

    const array = Object.keys(data)
        .map((key) => data[key])
        .sort((a, b) => b.created_at - a.created_at);

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
        <SafeAreaView
            style={[
                globalStyles.screenContainer,
                { paddingTop: 0, paddingHorizontal: 0 },
            ]}
        >
            <View
                style={{
                    flexDirection: "row",
                    top: 16,
                    width: "100%",
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "space-between",
                    alignSelf: "center",
                    marginBottom: 12,
                }}
            >
                <BackButton
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
                {pubkey === loggedInPubkey ? (
                    <CustomButton
                        text="Edit"
                        buttonConfig={{
                            onPress: () => {
                                navigation.navigate("EditProfileScreen");
                            },
                        }}
                    />
            ) : <View/>}
            </View>
            <View
                style={{
                    flex: 1,
                    width: "100%",
                }}
                onLayout={onLayoutViewWidth}
            >
                <FlashList
                    data={array}
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
                                onPress: () => {
                                    listRef.current.prepareForLayoutAnimationRender();
                                    setPage(page + 1);
                                },
                            }}
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
        </SafeAreaView>
    );
};

export default ProfileScreen;
