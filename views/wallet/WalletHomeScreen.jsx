import { View, Text, useWindowDimensions, Pressable } from 'react-native';
import React from 'react';
import { useGetWalletBalanceQuery } from '../../services/walletApi';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';
import { useIsFocused } from '@react-navigation/native';
import { colors, globalStyles } from '../../styles';
import useBalance from '../../features/wallet/hooks/useBalance';
import PressableIcon from '../../components/PressableIcon';

const WalletHomeScreen = ({ navigation: { navigate } }) => {
  const { data, error, refetch } = useGetWalletBalanceQuery(null, {
    skip: !useIsFocused(),
  });
  useBalance();

  const device = useWindowDimensions();
  return (
    <View style={globalStyles.screenContainer}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-evenly',
        }}
      >
        <View style={{ flex: 1 }}>
          <PressableIcon
            icon="information-circle"
            label="Info"
            onPress={() => {
              navigate('WalletInfoScreen');
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <PressableIcon
            icon="list"
            label="Transactions"
            onPress={() => {
              navigate('WalletTransactionScreen');
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <PressableIcon
            icon="key"
            label="Connect"
            onPress={() => {
              navigate('WalletConnectScreen');
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <PressableIcon
            icon="reload"
            label="Reload"
            onPress={() => {
              refetch();
            }}
          />
        </View>
      </View>
      <View
        style={{ flex: 1, justifyContent: 'center', flexDirection: 'column' }}
      >
        <Text style={[globalStyles.textH1, { textAlign: 'center' }]}>
          {data ? `${data.balance} SATS` : 'Loading...'}
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            justifyContent: 'space-between',
            marginBottom: device.height / 30,
          }}
        >
          <CustomButton
            text="Send"
            buttonConfig={{
              onPress: () => {
                navigate('WalletSendScreen');
              },
            }}
            containerStyles={{ flex: 1, marginRight: 6 }}
            icon="arrow-up-circle"
          />
          <CustomButton
            text="Receive"
            buttonConfig={{
              onPress: () => {
                navigate('WalletReceiveScreen');
              },
            }}
            containerStyles={{ flex: 1, marginLeft: 6 }}
            icon="arrow-down-circle"
          />
        </View>
        <Pressable
          style={{
            width: device.width / 6,
            height: device.width / 6,
            borderRadius: device.width / 3,
            backgroundColor: colors.primary500,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigate('ScannerScreen');
          }}
        >
          <Ionicons name="qr-code" color="white" size={device.width / 16} />
        </Pressable>
      </View>
    </View>
  );
};

export default WalletHomeScreen;
