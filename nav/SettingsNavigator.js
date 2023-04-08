import { createStackNavigator } from "@react-navigation/stack";
import DisplayKeysScreen from "../views/settings/DisplayKeysScreen";
import SettingsHomeScreen from "../views/settings/SettingsHomeScreen";
import SettingsNetworkScreen from "../views/settings/SettingsNetworkScreen";
import SettingsPaymentsScreen from "../views/settings/SettingsPaymentsScreen";
import SettingsUserScreen from "../views/settings/SettingsUserScreen";
import SettingsDeleteAccountScreen from "../views/settings/SettingsDeleteAccountScreen";
import RelaysSettingsView from "../features/relays/views/RelaysSettingsView";


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
                name="Backup Keys"
                component={DisplayKeysScreen}
            />
            <Stack.Screen
                name="Relay Network"
                component={SettingsNetworkScreen}
            />
            <Stack.Screen
                name="Network Settings"
                component={RelaysSettingsView}
            />
            <Stack.Screen
                name="Payment Settings"
                component={SettingsPaymentsScreen}
            />
            <Stack.Screen
                name="Muted Users"
                component={SettingsUserScreen}
            />
            <Stack.Screen
                name="Delete Account"
                component={SettingsDeleteAccountScreen}
            />
        </Stack.Navigator>
    );
};

export default SettingsNavigator;
