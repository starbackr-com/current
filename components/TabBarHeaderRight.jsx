import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGetWalletBalanceQuery } from '../services/walletApi';
import { colors, globalStyles } from '../styles';

const TabBarHeaderRight = () => {
  const navigation = useNavigation();
  const { data } = useGetWalletBalanceQuery();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
        onPress={() => {
          navigation.navigate('Wallet');
        }}
      >
        <Text style={globalStyles.textBody}>
          {data
            ? `${
                data.balance.length > 4
                  ? `${Math.round(data.balance / 1000)}k`
                  : data.balance
              }`
            : '----'}{' '}
          <Text style={[globalStyles.textBodyS, { color: colors.primary500 }]}>
            SATS
          </Text>
        </Text>
        <Ionicons name="wallet-outline" size={20} color={colors.primary500} />
      </Pressable>
      <Ionicons
        name="notifications-outline"
        size={20}
        color={colors.primary500}
        style={{ marginHorizontal: 16 }}
        onPress={() => {
          navigation.navigate('MentionsModal');
        }}
      />
    </View>
  );
};

export default TabBarHeaderRight;
