import { createStackNavigator } from "@react-navigation/stack";
import DisplayKeysScreen from "../views/settings/DisplayKeysScreen";
import SettingsHomeScreen from "../views/settings/SettingsHomeScreen";


const Stack = createStackNavigator();

const SettingsNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="SettingsHomeScreen"
                component={SettingsHomeScreen}
            />
            <Stack.Screen
                name="Backup"
                component={DisplayKeysScreen}
            />
        </Stack.Navigator>
    );
};

export default SettingsNavigator;