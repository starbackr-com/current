import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import devLog from '../../../utils/internal';
import { pool } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';
import TrendingNote from '../components/TrendingNote';
import { globalStyles } from '../../../styles';
import TrendingImages from '../components/TrendingImages';

const TrendingView = () => {
  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
      style={{width: '100%'}}
        data={[{content: 'Bla!'}]}
        renderItem={({ item }) => <TrendingNote event={item} />}
        ItemSeparatorComponent={() => <View style={{height:  20, backgroundColor: 'red', width: '100%'}}/>}
        ListHeaderComponent={<TrendingImages />}
      />
    </View>
  );
};

export default TrendingView;
