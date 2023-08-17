import { View, Pressable } from 'react-native';
import React, { useState } from 'react';
import Animated, {
  withSequence,
  withTiming,
  withRepeat,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useZapNote } from '../../../hooks/useZapNote';
import { colors } from '../../../styles';
import { publishRepost } from '../../../utils/nostrV2';

const ActionBar = ({ user, event, width, onMenu }) => {
  const [zapPending, setZapPending] = useState(false);
  const [repostPending, setRepostPending] = useState(false);
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
    setRepostPending(true);
    await publishRepost(event.id, event.pubkey);
    setRepostPending(false);
  };
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
      }}
    >
      {isPremium && (user?.lud06 || user?.lud16) ? (
        <Pressable
          style={({ pressed }) => [
            {
              width: (width / 100) * 8,
              height: (width / 100) * 8,
              borderRadius: (width / 100) * 4,
              backgroundColor: colors.backgroundSecondary,
              marginBottom: 16,
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
              size={(width / 100) * 5}
            />
          </Animated.View>
        </Pressable>
      ) : undefined}
      <Pressable
        style={{
          width: (width / 100) * 8,
          height: (width / 100) * 8,
          borderRadius: (width / 100) * 4,
          backgroundColor: colors.backgroundSecondary,
          marginBottom: 16,
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
          size={(width / 100) * 5}
        />
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {
            width: (width / 100) * 8,
            height: (width / 100) * 8,
            borderRadius: (width / 100) * 4,
            backgroundColor: colors.backgroundSecondary,
            marginBottom: 16,
            alignItems: 'center',
            justifyContent: 'center',
          },
          pressed ? { backgroundColor: '#777777' } : undefined,
        ]}
        onPress={repostHandler}
      >
        <Animated.View style={[repostPending ? zapStyle : { opacity: 1 }]}>
          <Ionicons
            name="repeat"
            color={colors.primary500}
            size={(width / 100) * 5}
          />
        </Animated.View>
      </Pressable>
      <Pressable
        style={{
          width: (width / 100) * 8,
          height: (width / 100) * 8,
          borderRadius: (width / 100) * 4,
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
          size={(width / 100) * 5}
        />
      </Pressable>
    </View>
  );
};

export default ActionBar;
