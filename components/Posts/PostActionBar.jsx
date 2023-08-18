import { View, Pressable, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
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

const PostActionBar = memo(
  ({
    onPressComment,
    onPressMore,
    onPressZap,
    zapDisabled,
    onPressLike,
    isLiked,
  }) => {
    const isPremium = useSelector((state) => state.auth.isPremium);
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 32,
          gap: 10,
        }}
      >
        {isPremium ? (
          <Pressable
            style={({ pressed }) => [
              styles.buttonContainer,
              pressed && !zapDisabled
                ? styles.buttonContainerActive
                : undefined,
            ]}
            onPress={!zapDisabled ? onPressZap : undefined}
          >
            <Ionicons
              name="flash-outline"
              color={zapDisabled ? 'grey' : colors.primary500}
              size={16}
            />
          </Pressable>
        ) : undefined}
        <Pressable
          style={({ pressed }) => [
            styles.buttonContainer,
            pressed ? styles.buttonContainerActive : undefined,
          ]}
          onPress={onPressComment}
        >
          <Ionicons
            name="chatbubble-outline"
            color={colors.primary500}
            size={16}
          />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.buttonContainer,
            pressed ? styles.buttonContainerActive : undefined,
          ]}
          onPress={onPressLike}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            color={colors.primary500}
            size={16}
          />
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
  },
);

export default PostActionBar;
