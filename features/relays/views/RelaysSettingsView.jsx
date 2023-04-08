import { View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';
import { RelayItem } from '../components';
import { globalStyles } from '../../../styles';

const RelaysSettingsView = () => {
  const relays = useSelector((state) => state.relays.relays);
  const relayArray = Object.keys(relays);
  return (
    <View style={globalStyles.screenContainer}>
      <Animated.FlatList
        data={relayArray}
        renderItem={({ item }) => <RelayItem relay={item} />}
        style={{ width: '100%' }}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default RelaysSettingsView;
