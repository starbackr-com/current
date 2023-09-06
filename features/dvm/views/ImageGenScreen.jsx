import { View, Text } from 'react-native';
import React from 'react';
import { globalStyles } from '../../../styles';
import { CustomKeyboardView, ExpandableInput } from '../../../components';

const ImageGenScreen = () => {
  return (
    <CustomKeyboardView>
      <View style={globalStyles.screenContainer}>
        <View style={{ flex: 1 }}></View>
        <ExpandableInput />
      </View>
    </CustomKeyboardView>
  );
};

export default ImageGenScreen;
