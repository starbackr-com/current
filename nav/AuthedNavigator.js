import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View, Pressable, Image } from "react-native";
import HomeView from "../views/HomeView";
import { createStackNavigator } from "@react-navigation/stack";
import TwitterModal from "../views/welcome/TwitterModal";
import colors from "../styles/colors";
import WalletNavigator from "./WalletNavigator";
import Input from "../components/Input";
import CustomButton from "../components/CustomButton";
import SettingsNavigator from "./SettingsNavigator";
import ProfileScreen from "../views/ProfileScreen";
import SearchScreen from "../views/SearchScreen";
import globalStyles from "../styles/globalStyles";
import { useGetWalletBalanceQuery } from "../services/walletApi";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import PostMenuModal from "../views/PostMenuModal";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = ({navigation}) => {
    const { data } = useGetWalletBalanceQuery(null, {
        skip: !useIsFocused(),
    });

    const pubKey = useSelector(state => state.auth.pubKey)
    const user = useSelector(state => state.messages.users[pubKey])
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home-sharp" : "home-outline";
                    } else if (route.name === "Wallet") {
                        iconName = focused ? "wallet" : "wallet-outline";
                    } else if (route.name === "Settings") {
                        iconName = focused ? "settings" : "settings-outline";
                    } else if (route.name === "Search") {
                        iconName = focused
                            ? "heart-circle"
                            : "heart-circle-outline";
                    } else if (route.name === "New") {
                        iconName = focused
                            ? "add-circle"
                            : "add-circle-outline";
                    }
                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                headerStyle: { backgroundColor: "#222222" },
                headerTitleStyle: {
                    color: "white",
                    fontFamily: "Montserrat-Bold",
                },
                headerTintColor: "red",
                tabBarActiveTintColor: colors.primary500,
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    backgroundColor: "#222222",
                    borderTopColor: colors.primary50,
                },
                tabBarShowLabel: false,
                headerShadowVisible: false,
                headerRight: () => (
                    <View
                        style={{
                            flexDirection: "row",
                            marginRight: 12,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text style={globalStyles.textBody}>
                            {data ? `${data.balance}` : "----"}
                        </Text>
                        <Text
                            style={[
                                globalStyles.textBody,
                                {
                                    fontFamily: "Satoshi-Symbol",
                                    marginLeft: 6,
                                    fontSize: 20,
                                },
                            ]}
                        >
                            S
                        </Text>
                    </View>
                ),
                headerLeft: () => <Pressable style={{width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginLeft: 12}} onPress={() => {navigation.navigate('ProfileModal', {user: pubKey})}}><Image source={{uri: user?.picture}} style={{width: 26, height: 26}}/></Pressable>
            })}
        >
            <Tab.Screen name="Home" component={HomeView} />
            <Tab.Screen name="Wallet" component={WalletNavigator} />
            <Tab.Screen
                name="New"
                component={WalletNavigator}
                options={({ navigation }) => ({
                    tabBarButton: (props) => (
                        <Pressable
                            {...props}
                            onPress={() => navigation.navigate("PostModal")}
                        />
                    ),
                })}
            />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Settings" component={SettingsNavigator} />
        </Tab.Navigator>
    );
};

const PostModal = ({ navigation }) => {
    const [content, setContent] = useState();
    return (
        <View style={[globalStyles.screenContainer]}>
            <Text style={globalStyles.textH1}>Create a post</Text>
            <Input
                inputStyle={{ flex: 3 }}
                textInputConfig={{ onChangeText: setContent }}
            />
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                }}
            >
                <View style={{ flex: 1 }}>
                    <CustomButton
                        text="Send"
                        buttonConfig={{
                            onPress: async () => {
                            },
                        }}
                    />
                </View>
                <View
                    style={{
                        flex: 2,
                        flexDirection: "row",
                        width: "50%",
                    }}
                >
                    <Pressable style={{marginRight: 24}}>
                        <Ionicons
                            name="image"
                            color={colors.primary500}
                            size={24}
                        />
                    </Pressable>
                    <Pressable>
                        <Ionicons
                            name="time"
                            color={colors.primary500}
                            size={24}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const AuthedNavigator = () => {
    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabNav" component={TabNavigator} />
                <Stack.Screen
                    name="TwitterModal"
                    component={TwitterModal}
                    options={{ presentation: "modal" }}
                />
                <Stack.Screen
                    name="PostModal"
                    component={PostModal}
                    options={{ presentation: "modal" }}
                />
                <Stack.Screen
                    name="ProfileModal"
                    component={ProfileScreen}
                    options={{ presentation: "modal" }}
                />
                <Stack.Screen
                    name="PostMenuModal"
                    component={PostMenuModal}
                    options={{ presentation: "transparentModal" }}
                />
            </Stack.Navigator>
        </>
    );
};

export default AuthedNavigator;
