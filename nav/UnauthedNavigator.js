import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../views/welcome/WelcomeScreen";
import ShowBackupScreen from "../views/welcome/ShowBackupScreen";
import ImportKeysScreen from "../views/welcome/ImportKeysScreen";
import CreateProfileScreen from "../views/welcome/CreateProfileScreen";
import SelectImage from "../views/welcome/SelectImage";
import UsernameScreen from "../views/welcome/UsernameScreen";
import LoadingProfileScreen from "../views/welcome/LoadingProfileScreen";
import ImportSingleKeyScreen from "../views/welcome/ImportSingleKeyScreen";
import EULAScreen from "../views/welcome/EULAScreen";

const Stack = createStackNavigator();

const UnauthedNavigator = () => {
    return (
        <>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: "#18181b" },
                    headerTitleStyle: { color: "white" },
                    headerTitle: () => null,
                    headerLeft: () => null,
                    // gestureEnabled: false
                }}
            >
                <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{
                        title: "Welcome!",
                    }}
                />
                <Stack.Screen
                    name="UsernameScreen"
                    component={UsernameScreen}
                    options={{
                        title: "",
                    }}
                />
                <Stack.Screen
                    name="ShowBackupScreen"
                    component={ShowBackupScreen}
                    options={{
                        title: "",
                    }}
                />
                <Stack.Screen
                    name="ImportKeys"
                    component={ImportKeysScreen}
                    options={{
                        title: "",
                    }}
                />
                <Stack.Screen
                    name="ImportSingleKeyScreen"
                    component={ImportSingleKeyScreen}
                    options={{
                        title: "",
                    }}
                />
                <Stack.Screen
                    name="CreateProfileScreen"
                    component={CreateProfileScreen}
                    options={{
                        title: "",
                    }}
                />
                <Stack.Screen
                    name="LoadingProfileScreen"
                    component={LoadingProfileScreen}
                    options={{
                        title: "",
                    }}
                />
                <Stack.Screen
                    name="EULA"
                    component={EULAScreen}
                    options={{
                        title: "",
                    }}
                />
                <Stack.Screen
                    name="SelectImageScreen"
                    component={SelectImage}
                    options={{ presentation: "modal", headerShown: false }}
                />
            </Stack.Navigator>
        </>
    );
};

export default UnauthedNavigator;
