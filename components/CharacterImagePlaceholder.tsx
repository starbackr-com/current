import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, globalStyles } from '../styles';

type CharacterImagePlaceholderProps = {
  name: string;
};

const CharacterImagePlaceholder = ({
  name,
}: CharacterImagePlaceholderProps) => {
  return (
    <View style={styles.container}>
      <Text style={[globalStyles.textH2, styles.text]}>{name.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginBottom: 0
  }
});

export default CharacterImagePlaceholder;
