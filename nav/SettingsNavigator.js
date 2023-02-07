import { createStackNavigator } from "@react-navigation/stack";
import DisplayKeysScreen from "../views/settings/DisplayKeysScreen";
import SettingsHomeScreen from "../views/settings/SettingsHomeScreen";
import SettingsNetworkScreen from "../views/settings/SettingsNetworkScreen";
import SettingsPaymentsScreen from "../views/settings/SettingsPaymentsScreen";


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
            <Stack.Screen
                name="Network"
                component={SettingsNetworkScreen}
            />
            <Stack.Screen
                name="Payments"
                component={SettingsPaymentsScreen}
            />
        </Stack.Navigator>
    );
};

export default SettingsNavigator;