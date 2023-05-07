/* eslint-disable no-underscore-dangle */
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import Animated, { SlideOutRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../../styles';
import { removeRelay } from '../relaysSlice';
import { pool } from '../../../utils/nostrV2';
import { useNavigation } from "@react-navigation/native";

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

const WalletconnectItem = ({relay }) => {
  const relayUrl = relay.name;
  const state = 1;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const removeHandler = () => {
    Alert.alert('Remove Relay?', `Do you really want to remove ${relay.name}?`, [
      {
        text: 'Yes',
        onPress: () => {
          dispatch(removeRelay(relay.name));
        },
        style: 'destructive',
      },
      { text: 'No' },
    ]);
  };

  return (
    <Animated.View exiting={SlideOutRight}>
      <Pressable
      onPress={() => {  navigation.navigate('WalletconnectInfoView', {relay: relay.name});

      }}
      onLongPress={removeHandler} style={style.container} >
      <Ionicons
        name="key-outline"
        color={state === 1 ? 'green' : 'red'}
      />
        <Text style={[globalStyles.textBody]}>{relay.name} </Text>
        <View>
        <Text style={[globalStyles.textBody]}> Max: {relay.maxamount}</Text>

        </View>
      </Pressable>
    </Animated.View>
  );
};

export default WalletconnectItem;
