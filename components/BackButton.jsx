import { Text } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, globalStyles } from '../styles';

const BackButton = ({ onPress, text }) => (
  <Text
    onPress={onPress}
    style={[
      globalStyles.textBody,
      { color: colors.primary500, textAlign: 'left' },
    ]}
  >
    <Ionicons name="arrow-back" /> {text || 'Back'}
  </Text>
);

export default BackButton;
