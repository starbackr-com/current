import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import WalletView from "../views/WalletView";
import SettingsView from "../views/SettingsView";
import FeedView from "../views/FeedView";
import HomeView from "../views/HomeView";
import { createStackNavigator } from "@react-navigation/stack";
import TwitterModal from "../views/welcome/TwitterModal";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const TabNavigator = () => {
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
                            iconName = focused
                                ? "settings"
                                : "settings-outline";
                        }
                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    },
                    headerStyle: { backgroundColor: "#18181b" },
                    headerTitleStyle: { color: "white" },
                    headerTintColor: "red",
                    tabBarActiveTintColor: "#5E88BF",
                    tabBarInactiveTintColor: "gray",
                    tabBarStyle: { backgroundColor: "#18181b" },
                    headerShadowVisible: false
                })}
            >
                <Tab.Screen name="Home" component={HomeView} />
                <Tab.Screen name="Wallet" component={WalletView} />
                <Tab.Screen name="Settings" component={SettingsView} />
                <Tab.Screen name="Feed" component={FeedView} />
            </Tab.Navigator>
    );
};

const AuthedNavigator = () => {
    return (
        <>
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="MainTabNav" component={TabNavigator} />
            <Stack.Screen
                name="TwitterModal"
                component={TwitterModal}
                options={{ presentation: "modal" }}
            />
        </Stack.Navigator>
        </>
    );
};

export default AuthedNavigator;
