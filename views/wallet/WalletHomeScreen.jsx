import { View, Text, useWindowDimensions, Pressable } from 'react-native';
import React, { useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { useGetWalletBalanceQuery } from '../../services/walletApi';
import CustomButton from '../../components/CustomButton';
import { colors, globalStyles } from '../../styles';
import useBalance from '../../features/wallet/hooks/useBalance';
import PressableIcon from '../../components/PressableIcon';
import MenuBottomSheet from '../../components/MenuBottomSheet';
import { TopUpCard } from '../../features/wallet/components';
import { LoadingSpinner } from '../../components';
import { getSatProducts } from '../../features/premium';

const WalletHomeScreen = ({ navigation: { navigate } }) => {
  const [products, setProducts] = useState();
  const { data, refetch } = useGetWalletBalanceQuery(null, {
    skip: !useIsFocused(),
  });
  useBalance();
  const modalRef = useRef();

  const device = useWindowDimensions();
  const modalRefetch = () => {
    refetch();
    modalRef.current.dismiss();
  };
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
            icon="list"
            label="History"
            onPress={() => {
              navigate('WalletTransactionScreen');
            }}
          />
        </View>
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
        <View style={{ flex: 1 }}>
          <PressableIcon
            icon="cash"
            label="Top Up"
            onPress={async () => {
              modalRef.current.present();
              const rcProducts = await getSatProducts();
              setProducts(rcProducts);
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
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: device.height / 30,
            gap: 10,
          }}
        >
          <CustomButton
            text="Send"
            buttonConfig={{
              onPress: () => {
                navigate('WalletSendScreen');
              },
            }}
            containerStyles={{ flex: 1 }}
            icon="arrow-up-circle"
          />
          <CustomButton
            text="Receive"
            buttonConfig={{
              onPress: () => {
                navigate('WalletReceiveScreen');
              },
            }}
            containerStyles={{ flex: 1 }}
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
      <MenuBottomSheet ref={modalRef}>
        {products ? (
          <View>
            <Text style={[globalStyles.textH2, { textAlign: 'center' }]}>
              {products.length > 0
                ? 'Top up your wallet!'
                : 'No products found'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {products.map((product) => (
                <TopUpCard product={product} refetchFn={modalRefetch} />
              ))}
            </View>
          </View>
        ) : (
          <LoadingSpinner size={24} />
        )}
      </MenuBottomSheet>
    </View>
  );
};

export default WalletHomeScreen;
