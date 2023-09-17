import { View, Text } from 'react-native';
import React from 'react';
import { colors, globalStyles } from '../../../styles';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const DVMHeader = ({onPress}) => {
  return (
    <View
      style={{
        backgroundColor: colors.backgroundSecondary,
        flexDirection: 'row',
        width: '100%',
        justifyContent: "space-between",
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[globalStyles.textBodyBold, { marginBottom: 0 }]}>
          Image Generation DVM
        </Text>
        <MaterialCommunityIcons
          name="alpha"
          size={32}
          color={colors.primary500}
        />
      </View>
      <AntDesign name="questioncircleo" size={22} color={colors.primary500} onPress={onPress}/>
    </View>
  );
};

export default DVMHeader;
