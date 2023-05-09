/* eslint-disable react/jsx-one-expression-per-line */
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { SlideOutRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../../styles';
import { changeWalletconnect } from '../walletconnectSlice';

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionItems: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    justifyContent: 'space-evenly',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
});

const WalletconnectItem = ({ wcdata }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { walletBearer } = useSelector((state) => state.auth);

  const removeHandler = () => {

    if (wcdata.status === 'active') {

      Alert.alert(
        'Deactivate this link?',
        `Clients using this link "${wcdata.name}" cannot use this wallet.`,
        [
          {
            text: 'Yes',
            onPress: async () => {
              const wcUpdated = { ...wcdata, status: 'inactive' };

              const response = await fetch(
                `${process.env.BASEURL}/v2/walletconnect`,
                {
                  method: 'POST',
                  body: JSON.stringify(wcUpdated),
                  headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${walletBearer}`,
                  },
                },
              );
              wcdata.status = 'inactive';
              const data = await response.json();
              if (data.status === 'success') {
                dispatch(changeWalletconnect([wcUpdated]));
              }
            },
            style: 'destructive',
          },
          { text: 'No' },
        ],
      );

    } else {

      Alert.alert(
        'Activate this link?',
        `Clients using this link "${wcdata.name}" can use this wallet.`,
        [
          {
            text: 'Yes',
            onPress: async () => {
              const wcUpdated = { ...wcdata, status: 'active' };

              const response = await fetch(
                `${process.env.BASEURL}/v2/walletconnect`,
                {
                  method: 'POST',
                  body: JSON.stringify(wcUpdated),
                  headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${walletBearer}`,
                  },
                },
              );
              wcdata.status = 'active';
              const data = await response.json();
              if (data.status === 'success') {
                dispatch(changeWalletconnect([wcUpdated]));
              }
            },
            style: 'destructive',
          },
          { text: 'No' },
        ],
      );


    }

  };

  return (
    <Animated.View exiting={SlideOutRight}>
      <Pressable
        onPress={() => {
          navigation.navigate('WalletconnectInfoView', { data: wcdata });
        }}
        onLongPress={removeHandler}
        style={style.container}
      >
        <Ionicons
          name="key-outline"
          color={wcdata.status === 'active' ? 'green' : 'red'}
        />
        <Text style={[globalStyles.textBody]}>{wcdata.name} </Text>
        <View>
          <Text style={[globalStyles.textBodyG]}>
            {' '}
            SATS Limit: {wcdata.maxamount}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default WalletconnectItem;
