import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../../components/BackButton';
import { colors } from '../../../styles';

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#18181b',
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
});

const RelaySettingsHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={style.container}>
      <BackButton
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Ionicons name="add" size={24} color={colors.primary500} />
    </View>
  );
};

export default RelaySettingsHeader;
