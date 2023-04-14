/* eslint-disable no-underscore-dangle */
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import Animated, { SlideOutRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../../styles';
import { removeRelay } from '../relaysSlice';
import { pool } from '../../../utils/nostrV2';

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

const RelayItem = ({ relay }) => {
  const relayUrl = new URL(relay.url);
  const state = pool._conn[relayUrl].status;
  const dispatch = useDispatch();
  const removeHandler = () => {
    Alert.alert('Remove Relay?', `Do you really want to remove ${relay.url}?`, [
      {
        text: 'Yes',
        onPress: () => {
          dispatch(removeRelay(relay.url));
        },
        style: 'destructive',
      },
      { text: 'No' },
    ]);
  };

  return (
    <Animated.View exiting={SlideOutRight}>
      <Pressable onLongPress={removeHandler} style={style.container}>
        <Text style={[globalStyles.textBody]}>{relay.url}</Text>
        <View>
          <Ionicons
            name="cloud-circle"
            color={state === 1 ? 'green' : 'red'}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default RelayItem;
