import { View, Text, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import globalStyles from "../../styles/globalStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../styles/colors";
import Input from "../../components/Input";
import CustomButton from "../../components/CustomButton";
import { FlashList } from "@shopify/flash-list";
import { followMultipleUsers } from "../../utils/users";
import { decodePubkey } from "../../utils/nostr/keys";
import { useDispatch } from "react-redux";
import { setTwitterModal } from "../../features/introSlice";

const Stack = createStackNavigator();

const twitterRegex = /^@?(\w){1,15}$/;

const CustomHeader = ({ navigation }) => {
    return (
        <Pressable
            onPress={() => {
                navigation.navigate("Home");
            }}
        >
            <Ionicons name="chevron-down" size={32} color={colors.primary500} />
        </Pressable>
    );
};

const EnterHandleScreen = ({ navigation }) => {
    const [handle, setHandle] = useState("");
    const [error, setError] = useState(false);
    const submitHandler = () => {
        if (!twitterRegex.test(handle)) {
            setError(true);
            return;
        }
        if (handle[0] === "@") {
            const cutHandle = handle.slice(1);
            console.log(cutHandle);
            navigation.navigate("ChooseUsers", { handle: cutHandle });
            return;
        }
        navigation.navigate("ChooseUsers", { handle });
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Find people you know!</Text>
            <Text style={globalStyles.textBody}>
                Put your Twitter handle below and find your friends from
                Twitter!
            </Text>
            <Input
                inputStyle={{ marginTop: 32, width: "50%" }}
                textInputConfig={{
                    placeholder: "@getcurrent_app",
                    onChangeText: (e) => {
                        setError(false);
                        setHandle(e);
                    },
                    autoCapitalize: false,
                    autoCorrect: false,
                    autoComplete: "off",
                }}
            />
            {error ? (
                <Text style={[globalStyles.textBodyS, { color: "red" }]}>
                    This does not look like a valid Twitter handle...
                </Text>
            ) : undefined}
            <CustomButton
                text="Find friends"
                buttonConfig={{
                    onPress: submitHandler,
                }}
                disabled={handle.length < 3}
                containerStyles={{ marginTop: 32 }}
            />
            <CustomButton
                text="Skip"
                buttonConfig={{
                    onPress: () => {
                        navigation.navigate("RecommendedUsers");
                    },
                }}
                containerStyles={{ margin: 16 }}
            />
        </View>
    );
};

const UserCard = ({ data, isSelected, onClick }) => {
    const [image, setImage] = useState();
    const fallbackImg =
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

    useEffect(() => {
        setImage(data.profile);
    }, []);
    return (
        <Pressable
            style={[
                {
                    flexDirection: "row",
                    borderWidth: 1,
                    height: 50,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor: "#222222",
                    marginBottom: 12,
                    width: "90%",
                },
                isSelected ? { borderColor: colors.primary500 } : undefined,
            ]}
            onPress={onClick}
        >
            <Image
                source={{ uri: image }}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    marginLeft: 5,
                }}
                onError={() => {
                    setImage(fallbackImg);
                }}
            />
            <Text
                style={[globalStyles.textBodyS, { flex: 1, flexWrap: "wrap" }]}
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                {data.twitter_handle}
            </Text>
        </Pressable>
    );
};

const ChooseUserScreen = ({ route, navigation }) => {
    const [list, setList] = useState();
    const [selected, setSelected] = useState([]);
    const dispatch = useDispatch();

    const { handle } = route.params;
    console.log(handle);

    console.log(handle);
    const getFollowee = async (handle) => {
        try {
            const response = await fetch(
                `https://getcurrent.io/followuser?twitterhandle=${handle}`
            );
            const data = await response.json();
            setList(data.result);
            const newArray = [];
            data.result.map((item) => {
                newArray.push(item.twitter_handle);
            });
            setSelected(newArray);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getFollowee(handle);
    }, []);

    const selectItem = (handle) => {
        let newArray;
        if (selected.includes(handle)) {
            newArray = selected.filter((item) => item !== handle);
            setSelected(newArray);
            return;
        }
        newArray = [...selected];
        newArray.push(handle);
        setSelected(newArray);
    };

    const submitHandler = async () => {
        const pubkeys = list.map((item) => decodePubkey(item.pubkey));
        await followMultipleUsers(pubkeys);
        dispatch(setTwitterModal(true));
        navigation.reset({ index: 0, routes: [{ name: "MainTabNav" }] });
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textBody}>
                People you follow on Twitter:
            </Text>
            {list ? (
                <View
                    style={{
                        flex: 3,
                        width: "100%",
                        height: "100%",
                        padding: 5,
                        borderColor: "#222222",
                        borderWidth: 1,
                    }}
                >
                    <FlashList
                        extraData={selected}
                        data={list}
                        numColumns={2}
                        estimatedItemSize={52}
                        renderItem={({ item }) => (
                            <UserCard
                                data={item}
                                isSelected={selected.includes(
                                    item.twitter_handle
                                )}
                                onClick={selectItem.bind(
                                    this,
                                    item.twitter_handle
                                )}
                            />
                        )}
                    />
                </View>
            ) : undefined}
            <View style={{ flex: 1, justifyContent: "center" }}>
                <CustomButton
                    text={`Follow ${
                        selected.length === list?.length
                            ? "all"
                            : selected.length
                    } pubkeys`}
                    buttonConfig={{
                        onPress: submitHandler,
                    }}
                    disabled={selected.length < 1}
                />
            </View>
        </View>
    );
};

const RecommendedUsersScreen = () => {
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Recommended Users to Follow</Text>
        </View>
    );
};

const TwitterModal = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerTitle: () => <CustomHeader navigation={navigation} />,
                headerStyle: { backgroundColor: colors.backgroundPrimary },
                headerLeft: () => null,
                headerShadowVisible: false,
            })}
        >
            <Stack.Screen name="EnterHandle" component={EnterHandleScreen} />
            <Stack.Screen name="ChooseUsers" component={ChooseUserScreen} />
            <Stack.Screen
                name="RecommendedUsers"
                component={RecommendedUsersScreen}
            />
        </Stack.Navigator>
    );
};

export default TwitterModal;
