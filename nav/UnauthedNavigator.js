import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../views/welcome/WelcomeScreen";
import CreateKeysScreen from "../views/welcome/CreateKeysScreen";
import ShowBackupScreen from "../views/welcome/ShowBackupScreen";
import ImportKeysScreen from "../views/welcome/ImportKeysScreen";

const Stack = createStackNavigator();

const UnauthedNavigator = () => {
    return (
        <>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: "#18181b" },
                    headerTitleStyle: { color: "white" },
                    // headerLeft: ()=> null - Removes back button from nav
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
                    name="CreateKeys"
                    component={CreateKeysScreen}
                    options={{
                        title: "",
                    }}
                />
                <Stack.Screen
                    name="ShowBackup"
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
            </Stack.Navigator>
        </>
    );
};

export default UnauthedNavigator;
