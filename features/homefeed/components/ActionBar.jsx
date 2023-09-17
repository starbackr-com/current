import { View, Pressable, StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
  iconShadow: {
    shadowColor: colors.backgroundPrimary,
    textShadowOffset: { height: 0, width: 0 },
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});

const ActionBar = memo(({ user, event, width, onMenu, isZapped }) => {
  const [zapPending, setZapPending] = useState(false);
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
        gap: 32,
        marginRight: 6,
      }}
    >
      {isPremium && (user?.lud06 || user?.lud16) ? (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : undefined,
          ]}
          onPress={zapHandler}
        >
          <Animated.View style={[zapPending ? zapStyle : { opacity: 1 }]}>
            <Ionicons
              name={isZapped ? 'flash' : 'flash-outline'}
              color="white"
              size={Math.floor((width / 100) * 7)}
              style={styles.iconShadow}
            />
          </Animated.View>
        </Pressable>
      ) : undefined}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : undefined,
        ]}
        onPress={likeHandler}
      >
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          color="white"
          size={Math.floor((width / 100) * 7)}
          style={styles.iconShadow}
        />
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : undefined,
        ]}
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
          name="chatbubble-outline"
          color="white"
          size={Math.floor((width / 100) * 7)}
          style={styles.iconShadow}
        />
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : undefined,
        ]}
        onPress={repostHandler}
      >
        <Ionicons
          name="repeat"
          color={isReposted ? colors.backgroundSecondary : 'white'}
          size={Math.floor((width / 100) * 7)}
          style={styles.iconShadow}
        />
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : undefined,
        ]}
        onPress={() => {
          onMenu(event);
        }}
      >
        <Ionicons
          name="ellipsis-horizontal-circle"
          color="white"
          size={Math.floor((width / 100) * 7)}
          style={styles.iconShadow}
        />
      </Pressable>
    </View>
  );
});

export default ActionBar;
