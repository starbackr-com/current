import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import globalStyles from "../../styles/globalStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../styles/colors";
import Input from "../../components/Input";
import CustomButton from "../../components/CustomButton";
import { FlashList } from "@shopify/flash-list";

const Stack = createStackNavigator();

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
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Find people you know!</Text>
            <Text style={globalStyles.textBody}>
                Put your Twitter handle below and find people you are following
                on nostr!
            </Text>
            <Input
                inputStyle={{ marginVertical: 32, width: "50%" }}
                textInputConfig={{
                    placeholder: "@getcurrent_app",
                    onChangeText: (e) => {
                        setHandle(e);
                    },
                }}
            />
            <CustomButton
                text="Find friends"
                buttonConfig={{
                    onPress: () => {
                        navigation.navigate("ChooseUsers", { handle });
                    },
                }}
                disabled={handle.length < 3}
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

const UserCard = () => {};

const ChooseUserScreen = ({ route }) => {
    const [list, setList] = useState();
    const { handle } = route.params;
    const getFollowee = async (handle) => {
        try {
            const response = await fetch(
                `https://getcurrent.io/followuser?name=${handle}`
            );
            const data = await response.json();
            setList(data.result);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getFollowee(handle);
    }, []);
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textBody}>More text</Text>
            {list ? (
                <View style={{ flex: 1, width: "100%", height: "100%" }}>
                    <FlashList
                        data={list}
                        renderItem={({ item }) => (
                            <Text style={globalStyles.textBodyBold}>
                                {item.twitter_handle}
                            </Text>
                        )}
                    />
                </View>
            ) : undefined}
            <CustomButton
                text="Test"
                buttonConfig={{
                    onPress: () => {
                        console.log(list);
                    },
                }}
            />
        </View>
    );
};

const RecommendedUsersScreen = () => {
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textBody}>More text</Text>
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
