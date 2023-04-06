import { View, Text } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import globalStyles from '../../../styles/globalStyles';
import colors from '../../../styles/colors';

const IntroductionItem = ({ title, text, icon }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: colors.backgroundSecondary,
      marginVertical: 12,
      padding: 12,
      flex: 1,
    }}
  >
    <Ionicons name={icon} size={32} color={colors.primary500} />
    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text
        style={[globalStyles.textH2, { textAlign: 'left', marginBottom: 6 }]}
      >
        {title}
      </Text>
      <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>{text}</Text>
    </View>
  </View>
);

export default IntroductionItem;
