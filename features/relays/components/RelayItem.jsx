import { View, Text, Switch, StyleSheet, Pressable, Alert } from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import Animated, { SlideOutRight } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, globalStyles } from '../../../styles';
import { changeRelayMode, removeRelay } from '../relaysSlice';

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    padding: 6,
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
  const dispatch = useDispatch();

  const switchReadHandler = () => {
    dispatch(changeRelayMode({ ...relay, read: !relay.read }));
  };
  const switchWriteHandler = () => {
    dispatch(changeRelayMode({ ...relay, write: !relay.write }));
  };
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
        <Text style={[globalStyles.textBody, { maxWidth: '40%' }]}>
          {relay.url}
        </Text>
        <View style={style.actionItems}>
          <Pressable onPress={switchReadHandler}>
            <Ionicons
              name="reader"
              size={24}
              color={relay.read ? colors.primary500 : '#333333'}
            />
          </Pressable>
          <Pressable onPress={switchWriteHandler}>
            <Ionicons
              name="pencil"
              size={24}
              color={relay.write ? colors.primary500 : '#333333'}
            />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default RelayItem;
