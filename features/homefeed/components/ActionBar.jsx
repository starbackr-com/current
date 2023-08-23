import { View, Pressable } from 'react-native';
import React, { memo, useCallback, useState } from 'react';
import Animated, {
  withSequence,
  withTiming,
  withRepeat,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useZapNote } from '../../../hooks/useZapNote';
import { colors } from '../../../styles';
import { publishReaction, publishRepost } from '../../../utils/nostrV2';
import {
  addLike,
  addRepost,
  removeLike,
  removeRepost,
} from '../../interactionSlice';

const ActionBar = memo(({ user, event, width, onMenu }) => {
  const [zapPending, setZapPending] = useState(false);
  const [repostPending, setRepostPending] = useState(false);
  const likedEvents = useSelector((state) => state.interaction.likedEvents);
  const repostedEvents = useSelector(
    (state) => state.interaction.repostedEvents,
  );
  const isLiked = likedEvents.includes(event.id);
  const isReposted = repostedEvents.includes(event.id);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isPremium = useSelector((state) => state.auth.isPremium);
  const zap = useZapNote(
    event.id,
    user?.lud16 || user?.lud06,
    user?.name || event?.pubkey.slice(0, 16),
    event.pubkey,
  );

  const zapHandler = async () => {
    setZapPending(true);
    await zap();
    setZapPending(false);
  };

  const repostHandler = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch(addRepost([event.id]));
      await publishRepost(event.id, event.pubkey);
    } catch (e) {
      console.log(e);
      dispatch(removeRepost(event.id));
    }
  };

  const likeHandler = useCallback(async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch(addLike([event.id]));
      await publishReaction('+', event.id, event.pubkey);
    } catch (e) {
      dispatch(removeLike(event.id));
      console.log(e);
    }
  }, [dispatch, event]);

  const zapStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.1, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
    ),
  }));
  return (
    <View
      style={{
        flexDirection: 'column',
        width: '10%',
        gap: 16,
      }}
    >
      {isPremium && (user?.lud06 || user?.lud16) ? (
        <Pressable
          style={({ pressed }) => [
            {
              height: (width / 100) * 8,
              borderRadius: 10,
              backgroundColor: colors.backgroundSecondary,
              alignItems: 'center',
              justifyContent: 'center',
            },
            pressed ? { backgroundColor: '#777777' } : undefined,
          ]}
          onPress={zapHandler}
        >
          <Animated.View style={[zapPending ? zapStyle : { opacity: 1 }]}>
            <Ionicons
              name="flash"
              color={colors.primary500}
              size={Math.floor((width / 100) * 5)}
            />
          </Animated.View>
        </Pressable>
      ) : undefined}
      <Pressable
        style={{
          height: (width / 100) * 8,
          borderRadius: 10,
          backgroundColor: isLiked
            ? colors.primary500
            : colors.backgroundSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={likeHandler}
      >
        <Ionicons
          name="heart"
          color={isLiked ? colors.backgroundSecondary : colors.primary500}
          size={Math.floor((width / 100) * 5)}
        />
      </Pressable>
      <Pressable
        style={{
          height: (width / 100) * 8,
          borderRadius: 10,
          backgroundColor: colors.backgroundSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          navigation.navigate('CommentScreen', {
            eventId: event.id,
            rootId: event.id,
            type: 'root',
            event,
          });
        }}
      >
        <Ionicons
          name="chatbubble-ellipses"
          color={colors.primary500}
          size={Math.floor((width / 100) * 5)}
        />
      </Pressable>
      <Pressable
        style={{
          height: (width / 100) * 8,
          borderRadius: 10,
          backgroundColor: isReposted
            ? colors.primary500
            : colors.backgroundSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={repostHandler}
      >
        <Ionicons
          name="repeat"
          color={isReposted ? colors.backgroundSecondary : colors.primary500}
          size={Math.floor((width / 100) * 5)}
        />
      </Pressable>
      <Pressable
        style={{
          height: (width / 100) * 8,
          borderRadius: 10,
          backgroundColor: colors.backgroundSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          onMenu(event);
        }}
      >
        <Ionicons
          name="ellipsis-horizontal"
          color={colors.primary500}
          size={Math.floor((width / 100) * 5)}
        />
      </Pressable>
    </View>
  );
});

export default ActionBar;
