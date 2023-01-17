import { createStackNavigator } from "@react-navigation/stack";
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
        </Stack.Navigator>
    );
};

export default SettingsNavigator;