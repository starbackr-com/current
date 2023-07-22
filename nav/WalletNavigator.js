import { createStackNavigator } from '@react-navigation/stack';
import QrScanner from '../components/QrScanner';
import WalletConfirmScreen from '../views/wallet/WalletConfirmScreen';
import WalletHomeScreen from '../views/wallet/WalletHomeScreen';
import WalletInfoScreen from '../views/wallet/WalletInfoScreen';
import WalletInvoiceScreen from '../views/wallet/WalletInvoiceScreen';
import WalletConnectScreen from "../features/walletconnect/nav/WalletconnectSettingsNav";
import WalletSendLnurlScreen from '../views/wallet/WalletSendLnurlScreen';
import WalletTransactionScreen from '../views/wallet/WalletTransactionScreen';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../styles';
import { BackHeader } from '../components';
import { SendScreen, ReceiveScreen } from '../features/wallet/views';

const Stack = createStackNavigator();

const WalletNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <Stack.Navigator
        screenOptions={({navigation}) => ({header: () => <BackHeader navigation={navigation} />})}
      >
        <Stack.Screen name="WalletHomeScreen" component={WalletHomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="WalletSendScreen" component={SendScreen}/>
        <Stack.Screen
          name="WalletConfirmScreen"
          component={WalletConfirmScreen}
        
        />
        <Stack.Screen
          name="WalletReceiveScreen"
          component={ReceiveScreen}
        
        />
        <Stack.Screen
                name="WalletInvoiceScreen"
                component={WalletInvoiceScreen}
              
        />
        <Stack.Screen
                name="WalletConnectScreen"
                component={WalletConnectScreen}
                options={{headerShown: false}}
            />
        <Stack.Screen name="ScannerScreen" component={QrScanner}/>
        <Stack.Screen name="WalletInfoScreen" component={WalletInfoScreen}/>
        <Stack.Screen
          name="WalletTransactionScreen"
          component={WalletTransactionScreen}
          options={({navigation}) => ({header: () => <BackHeader navigation={navigation} />})}
        />
        <Stack.Screen
          name="WalletSendLnurlScreen"
          component={WalletSendLnurlScreen}
        
        />
      </Stack.Navigator>
    </View>
  );
};

export default WalletNavigator;
