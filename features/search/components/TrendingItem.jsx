import { Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, colors } from '../../../styles';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: 10,
    marginHorizontal: 6,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: '#3f3f46',
  },
});

const TrendingItem = ({ icon, title }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={({ pressed }) => [
        style.container,
        pressed ? style.pressed : undefined,
      ]}
      onPress={() => {
        navigation.navigate(title);
      }}
    >
      <Ionicons name={icon} color={colors.primary500} />
      <Text style={globalStyles.textBody}>{title}</Text>
    </Pressable>
  );
};

export default TrendingItem;
