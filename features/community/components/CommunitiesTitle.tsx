import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../../styles';

const CommunitiesTitle = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Communities</Text>
      <MaterialCommunityIcons name="alpha" size={24} color={colors.primary500} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    ...globalStyles.textH2,
    marginBottom: 0,
    marginRight: 12
  },
  icon: {
    color: colors.primary500
  }
})

export default CommunitiesTitle;
