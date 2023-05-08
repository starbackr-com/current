import {
  View,
  Text,
  Pressable,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../styles';

type PressableIconType = {
  icon: keyof typeof Ionicons.glyphMap,
  onPress: (event: GestureResponderEvent) => void,
  label?: string,
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: colors.backgroundSecondary,
    marginBottom: 6
  },
  active: {
    backgroundColor: colors.backgroundActive,
  },
});

const PressableIcon = ({ icon, onPress, label }: PressableIconType) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.container,
            pressed ? styles.active : undefined,
          ]}
        >
          <Ionicons name={icon} size={24} color={colors.primary500} />
        </Pressable>
      {label ? <Text style={globalStyles.textBodyS}>{label}</Text> : undefined}
    </View>
  );
};

export default PressableIcon;
