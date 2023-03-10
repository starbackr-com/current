import { View, Text } from "react-native";
import React, { useState } from "react";
import globalStyles from "../styles/globalStyles";
import { FlashList } from "@shopify/flash-list";
import { useSelector } from "react-redux";
import CustomButton from "../components/CustomButton";
import { Pressable } from "react-native";
import colors from "../styles/colors";
import Input from "../components/Input";
import { decodePubkey } from "../utils/nostr/keys";
import { followUser, unfollowUser } from "../utils/users";
import { getUserData, updateFollowedUsers } from "../utils/nostrV2/getUserData";
import { Image } from "expo-image";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigation } from "@react-navigation/native";
import { useFollowUser } from "../hooks/useFollowUser";
import { useUnfollowUser } from "../hooks/useUnfollowUser";

const hexRegex = /^[0-9a-f]{64}$/i;

const bech32Regex = /^(npub)[a-zA-HJ-NP-Z0-9]+$/i;

const twitterRegex = /^@?(\w){1,15}$/;

const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

const ResultCard = ({ pk }) => {
    const user = useSelector((state) => state.messages.users[pk]);
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
    const navigation = useNavigation();
    const { follow } = useFollowUser();
    const { unfollow } = useUnfollowUser();
    return (
        <View
            style={{
                backgroundColor: colors.backgroundSecondary,
                padding: 6,
                borderRadius: 10,
                width: "90%",
                alignItems: "center",
            }}
        >
            <Pressable
                style={{
                    borderWidth: 1,
                    borderColor: colors.primary500,
                    alignItems: "center",
                    borderRadius: 10,
                    marginBottom: 12,
                    padding: 6,
                    backgroundColor: colors.backgroundPrimary,
                }}
                onPress={() => {
                    navigation.navigate("Profile", {
                        screen: "ProfileScreen",
                        params: { pubkey: pk },
                    });
                }}
            >
                <Image
                    source={
                        user?.picture ||
                        require("../assets/user_placeholder.jpg")
                    }
                    style={{ height: 50, width: 50, borderRadius: 25 }}
                />
                <Text style={globalStyles.textBodyBold}>
                    {user?.name || pk}
                </Text>
                <Text style={globalStyles.textBody}>{user?.about}</Text>
            </Pressable>

            {followedPubkeys.includes(pk) ? (
                <CustomButton
                    text="Unfollow"
                    buttonConfig={{
                        onPress: () => {
                            unfollow(pk);
                        },
                    }}
                />
            ) : (
                <CustomButton
                    text="Follow"
                    buttonConfig={{
                        onPress: () => {
                            follow([pk]);
                        },
                    }}
                />
            )}
        </View>
    );
};

const SearchScreen = ({ navigation }) => {
    const [input, setInput] = useState();
    const [result, setResult] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const searchHandler = async () => {
        setResult();
        setIsLoading(true);
        setError(false);
        if (input?.match(hexRegex)) {
            await getUserData([hexRegex]);
            setResult(input);
            setIsLoading(false);
        } else if (input?.match(bech32Regex)) {
            let pk = decodePubkey(input);
            console.log(pk);
            await getUserData([pk]);
            setResult(pk);
            setIsLoading(false);
        } else if (input?.match(twitterRegex)) {
            try {
                let handle = input[0] === "@" ? input : `@${input}`;
                const response = await fetch(
                    `${process.env.BASEURL}/pubkey/${handle}`
                );
                const data = await response.json();
                const npub = data.result.filter(
                    (result) => result.twitter_handle === handle
                )[0].pubkey;
                console.log(npub);
                const pk = decodePubkey(npub);
                await getUserData([pk]);
                setResult(pk);
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                setError(
                    "This does not seem to be a valid pubkey, npub, Twitter handle or nip05-address..."
                );
            }
        } else if (input?.match(emailRegex)) {
            try {
                const [name, domain] = input.toLowerCase().split("@");
                const response = await fetch(
                    `https://${domain}/.well-known/nostr.json?name=${name}`
                );
                const data = await response.json();
                const pk = data.names[name];
                await getUserData([pk]);
                setResult(pk);
                setIsLoading(false);
            } catch (e) {
                console.log(e);
            }
        } else {
            setResult();
            setError(
                "This does not seem to be a valid pubkey, npub, Twitter handle or nip05-address..."
            );
            setIsLoading(false);
        }
    };
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textBody}>
                Find people by pubkey, npub, Twitter handle, or nostr address
                (NIP05)
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    width: "80%",
                    justifyContent: "center",
                    marginTop: 12,
                }}
            >
                <Input
                    textInputConfig={{
                        onChangeText: setInput,
                        autoCapitalize: "none",
                        autocorrect: false,
                    }}
                />
                <CustomButton
                    icon="search"
                    containerStyles={{ marginLeft: 6 }}
                    buttonConfig={{ onPress: searchHandler }}
                />
            </View>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    width: "100%",
                    alignItems: "center",
                }}
            >
                {result ? <ResultCard pk={result} /> : undefined}
                {isLoading ? <LoadingSpinner size={64} /> : undefined}
                {error ? (
                    <Text style={globalStyles.textBodyError}>{error}</Text>
                ) : undefined}
            </View>
            <CustomButton
                text="Find people I follow on Twitter"
                buttonConfig={{
                    onPress: () => {
                        navigation.navigate("TwitterModal");
                    },
                }}
            />
        </View>
    );
};

export default SearchScreen;
