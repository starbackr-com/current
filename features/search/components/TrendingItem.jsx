import { Text, Pressable } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, colors } from '../../../styles';

const TrendingItem = ({ icon, title }) => {
  const navigation = useNavigation();
  return (
    <Pressable>
      <Ionicons name={icon} color={colors.primary500} />
      <Text style={globalStyles.textBody}>{title}</Text>
    </Pressable>
  );
};

export default TrendingItem;
