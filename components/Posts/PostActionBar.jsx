import { View, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../styles';

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 5,
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  buttonContainerActive: {
    backgroundColor: colors.backgroundActive,
  },
});

const PostActionBar = ({ onPressComment, onPressMore }) => (
  <View
    style={{
      flexDirection: 'row',
      marginTop: 32,
      gap: 10,
    }}
  >
    <Pressable
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed ? styles.buttonContainerActive : undefined,
      ]}
      onPress={onPressComment}
    >
      <Ionicons name="chatbubble-outline" color={colors.primary500} size={16} />
    </Pressable>
    <Pressable
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed ? styles.buttonContainerActive : undefined,
      ]}
      onPress={onPressMore}
    >
      <Ionicons
        name="ellipsis-horizontal-circle"
        color={colors.primary500}
        size={16}
      />
    </Pressable>
  </View>
);

export default PostActionBar;
