import { createStackNavigator } from "@react-navigation/stack";
import QrScanner from "../components/QrScanner";
import WalletConfirmScreen from "../views/wallet/WalletConfirmScreen";
import WalletHomeScreen from "../views/wallet/WalletHomeScreen";
import WalletInfoScreen from "../views/wallet/WalletInfoScreen";
import WalletInvoiceScreen from "../views/wallet/WalletInvoiceScreen";
import WalletReceiveScreen from "../views/wallet/WalletReceiveScreen";
import WalletSendLnurlScreen from "../views/wallet/WalletSendLnurlScreen";
import WalletSendScreen from "../views/wallet/WalletSendScreen";
import WalletTransactionScreen from "../views/wallet/WalletTransactionScreen";

const Stack = createStackNavigator();

const WalletNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="WalletHomeScreen"
                component={WalletHomeScreen}
            />
            <Stack.Screen
                name="WalletSendScreen"
                component={WalletSendScreen}
            />
            <Stack.Screen
                name="WalletConfirmScreen"
                component={WalletConfirmScreen}
            />
            <Stack.Screen
                name="WalletReceiveScreen"
                component={WalletReceiveScreen}
            />
            <Stack.Screen
                name="WalletInvoiceScreen"
                component={WalletInvoiceScreen}
            />
            <Stack.Screen name="ScannerScreen" component={QrScanner} />
            <Stack.Screen name="WalletInfoScreen" component={WalletInfoScreen} />
            <Stack.Screen name="WalletTransactionScreen" component={WalletTransactionScreen} />
            <Stack.Screen name="WalletSendLnurlScreen" component={WalletSendLnurlScreen} />
        </Stack.Navigator>
    );
};

export default WalletNavigator;