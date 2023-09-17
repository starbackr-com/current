import { View, Text } from 'react-native';
import React, { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../../styles';

const PullDownNote = memo(() => {
  return (
    <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
      <Ionicons name="arrow-down" color="white" size={12} />
      <Text style={globalStyles.textBodyS}>Pull down to load thread</Text>
      <Ionicons name="arrow-down" color="white" size={12} />
    </View>
  );
});

export default PullDownNote;
