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
import { Image } from 'expo-image';
import { Agent } from '../utils/agents';

type DVMSelectionItemProps = {
  agent: Agent;
  text: string;
  icon: string;
  color: string;
  onPress: () => void;
  disabled: boolean;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    height: 150,
    width: 100,
  },
  containerPressed: {
    backgroundColor: colors.backgroundActive,
  },
  proBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.primary500,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  }
});

const DVMSelectionItem = ({ agent, color, onPress }: DVMSelectionItemProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.containerPressed : undefined,
        { borderColor: color },
      ]}
      onPress={onPress}
    >
      <Image
        style={{ height: 80, width: 80, borderRadius: 40 }}
        source={agent.symbol}
      />
      <Text style={globalStyles.textBodyS}>{agent.title}</Text>
      {agent.paid ? <View style={styles.proBadge}>
        <Text style={{color: 'white'}}>Pro</Text>
      </View> : undefined}
    </Pressable>
  );
};

export default DVMSelectionItem;
