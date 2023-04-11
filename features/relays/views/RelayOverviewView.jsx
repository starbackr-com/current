import { Button, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Animated from 'react-native-reanimated';
import { RelayItem } from '../components';
import { globalStyles } from '../../../styles';

const RelaysSettingsView = ({ navigation }) => {
  const relays = useSelector((state) => state.relays.relays);
  return (
    <View style={globalStyles.screenContainer}>
      <Animated.FlatList
        data={relays}
        renderItem={({ item }) => <RelayItem relay={item} />}
        style={{ width: '100%' }}
        keyExtractor={(item) => item.url}
      />
    </View>
  );
};

export default RelaysSettingsView;
