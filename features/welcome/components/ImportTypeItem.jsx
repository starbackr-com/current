import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, globalStyles } from '../../../styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
    width: '96%',
  },
});

const ImportTypeItem = ({ title, text, example, icon, onPress }) => (
  <Pressable
    style={({ pressed }) => [
      styles.container,
      pressed ? { backgroundColor: '#333333' } : {},
    ]}
    onPress={onPress}
  >
    <Ionicons color={colors.primary500} name={icon} size={32} />
    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text
        style={[globalStyles.textH2, { textAlign: 'left', marginBottom: 6 }]}
      >
        {title}
      </Text>
      <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>{text}</Text>
      {example ? (
        <Text
          style={[
            globalStyles.textBodyS,
            { textAlign: 'left', color: colors.primary500 },
          ]}
        >
          {`Example: ${example}`}
        </Text>
      ) : undefined}
    </View>
  </Pressable>
);

export default ImportTypeItem;
