import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { EULAView, IntroductionView, StartUpView, UsernameView } from "../views";
import CreateProfileNavigator from "./CreateProfileNavigator";

const Stack = createStackNavigator();

const WelcomeNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#18181b" },
                headerTitleStyle: { color: "white" },
                headerTitle: () => null,
                headerLeft: () => null,
                headerShadowVisible: false,
                // gestureEnabled: false
            }}
        >
            <Stack.Screen
                name="Welcome"
                component={StartUpView}
                options={{
                    title: "Welcome!",
                }}
            />
            <Stack.Screen
                name="Introduction"
                component={IntroductionView}
                options={{
                    title: "",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="EULA"
                component={EULAView}
                options={{
                    title: "",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Username"
                component={UsernameView}
                options={{
                    title: "",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Profile"
                component={CreateProfileNavigator}
                options={{
                    title: "",
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default WelcomeNavigator;
