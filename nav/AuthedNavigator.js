import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View, Pressable, Image } from "react-native";
import HomeView from "../views/HomeView";
import { createStackNavigator } from "@react-navigation/stack";
import TwitterModal from "../views/welcome/TwitterModal";
import colors from "../styles/colors";
import WalletNavigator from "./WalletNavigator";
import SettingsNavigator from "./SettingsNavigator";
import ProfileScreen from "../views/ProfileScreen";
import SearchScreen from "../views/SearchScreen";
import globalStyles from "../styles/globalStyles";
import { useGetWalletBalanceQuery } from "../services/walletApi";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import PostMenuModal from "../views/PostMenuModal";
import PostView from "../views/post/PostView";
import FullScreenImage from "../components/Images/FullScreenImage";
import ReadMoreModal from "../features/homefeed/components/ReadMoreModal";
import VerifyTwitterModal from "../views/welcome/VerifyTwitterModal";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = ({ navigation }) => {
    const { data } = useGetWalletBalanceQuery(null, {
        skip: !useIsFocused(),
    });

    const pubKey = useSelector((state) => state.auth.pubKey);
    const user = useSelector((state) => state.messages.users[pubKey]);
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
                            ? "search-circle"
                            : "search-circle-outline";
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
                    <Pressable
                        style={{
                            flexDirection: "row",
                            marginRight: 12,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={() => {navigation.navigate('Wallet');}}
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
                                    color: colors.primary500
                                },
                            ]}
                        >
                            S
                        </Text>
                    </Pressable>
                ),
                headerLeft: () => (
                    <Pressable
                        style={{
                            width: 26,
                            height: 26,
                            borderRadius: 13,
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: 12,
                        }}
                        onPress={() => {
                            navigation.navigate("ProfileModal", {
                                pubkey: pubKey,
                            });
                        }}
                    >
                        {user?.picture ? (
                            <Image
                                source={{ uri: user?.picture }}
                                style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 13,
                                }}
                            />
                        ) : (
                            <Ionicons
                                name="person-circle-outline"
                                color="white"
                                size={24}
                            />
                        )}
                    </Pressable>
                ),
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
                            onPress={() => navigation.navigate("PostView")}
                        />
                    ),
                })}
            />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Settings" component={SettingsNavigator} />
        </Tab.Navigator>
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
                    name="VerifyTwitterModal"
                    component={VerifyTwitterModal}
                    options={{ presentation: "modal" }}
                />
                <Stack.Screen
                    name="PostView"
                    component={PostView}
                    options={{ presentation: "modal" }}
                />
                <Stack.Screen
                    name="ProfileModal"
                    component={ProfileScreen}
                    options={{ presentation: "modal" }}
                />
                <Stack.Screen
                    name="ImageModal"
                    component={FullScreenImage}
                    options={{ presentation: "transparentModal" }}
                />
                <Stack.Screen
                    name="ReadMoreModal"
                    component={ReadMoreModal}
                    options={{ presentation: "transparentModal" }}
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
