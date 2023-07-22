import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles';

type WarningToastProps = {
  text: string;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  }
})

const WarningToast = ({ text }: WarningToastProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="warning" size={24} color={'white'} />
      <Text style={globalStyles.textBodyBold}>{text}</Text>
    </View>
  );
};

export default WarningToast;
