import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../../styles';

type SettingItemProps = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: (event: GestureResponderEvent) => void;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
    // backgroundColor: colors.backgroundSecondary,
    padding: 12,
  },
  containerActive: {
    backgroundColor: colors.backgroundActive,
  },
  title: {
    ...globalStyles.textBodyBold,
    textAlign: 'left',
  },
});

const SettingItem = ({
  title,
  description,
  icon,
  onPress,
}: SettingItemProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.containerActive : undefined,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} color={colors.backgroundActive} size={32} />
      <View style={{ flex: 1, width: '100%' }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[globalStyles.textBodyG, { flex: 1, textAlign: 'left' }]}>
          {description}
        </Text>
      </View>
    </Pressable>
  );
};

export default SettingItem;
