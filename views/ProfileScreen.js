import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useParseContent } from "../hooks/useParseContent";
import { getUsersPosts } from "../features/profile/utils/getUsersPosts";
import ImagePost from "../components/Posts/ImagePost";
import { useSubscribePosts } from "../hooks/useSubscribePosts";


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
const ProfileHeader = ({ pubkey, user, loggedInPubkey }) => {
    const [copied, setCopied] = useState();
    const [verified, setVerified] = useState(false);
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);

    const navigation = useNavigation();

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
        <View style={{width: '100%'}}>
            <View style={{width: '100%', height: 20}}></View>
            <View style={{ padding: 12, width: '100%'}}>
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

const PostItem = ({ event, user }) => {
    const content = useParseContent(event);
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
                {content}
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
    const users = useSelector((state) => state.messages.users);
    const [width, setWidth] = useState();

    const loggedInPubkey = useSelector((state) => state.auth.pubKey);

    const now = new Date() / 1000;

    const [data, page, setPage] = useSubscribePosts([pubkey], now);

    const array = Object.keys(data).map((key) => data[key]);
    console.log(array.length)

    const user = users[pubkey];

    const getFeed = async () => {
        const response = await getUsersPosts(pubkey);
        const array = Object.keys(response)
            .map((key) => response[key])
            .sort((a, b) => {
                return a.created_at < b.created_at ? 1 : -1;
            });
        setFeed(array);
    };

    const onLayoutViewWidth = (e) => {
        setWidth(e.nativeEvent.layout.width);
    };

    const renderItem = ({ item }) => {console.log(item)
        if (item.type === "image") {
            console.log('Image!')
            return <ImagePost event={item} user={user} width={width} />;
        } else if (item.type === "text") {
            console.log('Text!')
            return <PostItem event={item} user={user} width={width} />;
        } else {
            console.log('None!')
        }
    };

    return (
        <View
            style={[
                globalStyles.screenContainer,
                {
                    paddingHorizontal: 0,
                    paddingTop: 0,
                    alignItems: "center",
                    width: '100%'
                },
            ]}
        >
            <Pressable
                style={{
                    flexDirection: "row",
                    top: 16,
                    width: "100%",
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    marginBottom: 24,
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
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onLayout={onLayoutViewWidth}
            >
                <View style={{width: '100%', height: 20}}></View>
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
                    ListFooterComponent={<CustomButton text='Load more' buttonConfig={{onPress: () => {setPage(page + 1)}}}/>}
                />
                <View style={{height: 36}}></View>
            </View>
            {pubkey === loggedInPubkey ? (
                <View style={{ position: "absolute", right: 32, top: 32 }}>
                    <CustomButton
                        text="Edit"
                        buttonConfig={{
                            onPress: () => {
                                navigation.navigate("EditProfileScreen");
                            },
                        }}
                    />
                </View>
            ) : undefined}
        </View>
    );
};

export default ProfileScreen;