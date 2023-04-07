import { View } from 'react-native';
import React from 'react';
import { colors } from '../../../styles';

const ItemSeperator = () => (
  <View
    style={{
      height: 1,
      backgroundColor: colors.backgroundSecondary,
      width: '100%',
      marginVertical: 5,
    }}
  />
);

export default ItemSeperator;
