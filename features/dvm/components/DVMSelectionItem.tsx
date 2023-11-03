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
import { useAppSelector } from '../../../hooks';

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
    height: 180,
    width: 100,
  },
  containerPressed: {
    backgroundColor: colors.backgroundActive,
  },
  proBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.backgroundActive,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});

const DVMSelectionItem = ({ agent, color, onPress }: DVMSelectionItemProps) => {
  const isPremium = useAppSelector((state) => state.auth.isPremium);
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
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Ionicons name="chatbubble" color="grey" />
        <Text style={globalStyles.textBodyG}>{agent.chatruns}</Text>
      </View>
      {agent.paid && !isPremium ? (
        <View style={styles.proBadge}>
          <Ionicons name="lock-closed" color={colors.primary500} />
        </View>
      ) : undefined}
    </Pressable>
  );
};

export default DVMSelectionItem;
