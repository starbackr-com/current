import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import React, { ReactElement, ReactNode } from 'react';
import { colors, globalStyles } from '../../../styles';
import { Ionicons } from '@expo/vector-icons';

type DVMSelectionItemProps = {
  text: string;
  icon: ReactNode;
  color: string;
  onPress: () => void;
  disabled: boolean;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  containerPressed: {
    backgroundColor: colors.backgroundActive,
  },
  containerDisabled: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.backgroundActive,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
});

const DVMSelectionItem = ({
  text,
  icon,
  color,
  onPress,
  disabled,
}: DVMSelectionItemProps) => {
  const { height } = useWindowDimensions();
  if (disabled) {
    return (
      <View style={[styles.containerDisabled, { height: height / 5 }]}>
        {icon}
        <View>
          <Text
            style={[globalStyles.textBody, { color: colors.backgroundActive }]}
          >
            {text}
          </Text>
          <Text
            style={[globalStyles.textBodyS, { color: colors.backgroundActive }]}
          >
            Coming soon!
          </Text>
        </View>
      </View>
    );
  }
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.containerPressed : undefined,
        { borderColor: color, height: height / 5 },
      ]}
      onPress={onPress}
    >
      {icon}
      <Text style={globalStyles.textBody}>{text}</Text>
    </Pressable>
  );
};

export default DVMSelectionItem;
