import { View, Text, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../../styles';

type FeatureCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
};

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12
  },
  title: {...globalStyles.textBodyBold},
  text: {...globalStyles.textBody, flex: 1},
});

const FeatureCard = memo(({ icon, title, text }: FeatureCardProps) => {
  return (
    <View style={style.container}>
      <Ionicons size={18} color={colors.primary500} name={icon} />
      <Text style={style.text}>{text}</Text>
    </View>
  );
});

export default FeatureCard;
