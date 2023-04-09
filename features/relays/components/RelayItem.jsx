import { View, Text, Switch, StyleSheet, Pressable, Alert } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { SlideOutRight } from 'react-native-reanimated';
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
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
});

const RelayItem = ({ relay }) => {
  const dispatch = useDispatch();
  const relayObject = useSelector((state) => state.relays.relays[relay]);

  const switchReadHandler = (updatedValue) => {
    const newObject = { ...relayObject, read: updatedValue };
    dispatch(changeRelayMode({ [relay]: newObject }));
  };
  const switchWriteHandler = (updatedValue) => {
    const newObject = { ...relayObject, write: updatedValue };
    dispatch(changeRelayMode({ [relay]: newObject }));
  };
  const removeHandler = () => {
    Alert.alert('Remove Relay?', `Do you really want to remove ${relay}?`, [
      {
        text: 'Yes',
        onPress: () => {
          dispatch(removeRelay(relay));
        },
        style: 'destructive',
      },
      { text: 'No' },
    ]);
  };

  return (
    <Animated.View exiting={SlideOutRight}>
      <Pressable onLongPress={removeHandler} style={style.container}>
        <Text
          style={[globalStyles.textBody, { maxWidth: '40%' }]}
        >
          {relay}
        </Text>
        <View style={style.actionItems}>
          <View style={style.action}>
            <Text style={[globalStyles.textBodyS, { marginRight: 6 }]}>
              Read
            </Text>
            <Switch
              value={relayObject.read}
              trackColor={{ true: colors.primary500 }}
              onValueChange={switchReadHandler}
            />
          </View>
          <View style={style.action}>
            <Text style={[globalStyles.textBodyS, { marginRight: 6 }]}>
              Write
            </Text>
            <Switch
              value={relayObject.write}
              trackColor={{ true: colors.primary500 }}
              onValueChange={switchWriteHandler}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default RelayItem;
