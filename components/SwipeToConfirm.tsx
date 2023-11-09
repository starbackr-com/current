import { View, Text } from 'react-native';
import React, { useState } from 'react';
import {
  Gesture,
  GestureDetector,
  Swipeable,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, globalStyles } from '../styles';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from './LoadingSpinner';

type SwipeToConfirmProps = {
  onConfirm: () => void;
  loading: boolean;
};

const SwipeToConfirm = ({ onConfirm, loading }: SwipeToConfirmProps) => {
  const [trackLength, setTrackLength] = useState(0);
  const [active, setActive] = useState(true);

  const translateX = useSharedValue(0);
  const textOpacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const pan = Gesture.Pan()
    .enabled(active)
    .onBegin(() => {
      textOpacity.value = withTiming(0);
    })
    .onChange((e) => {
      const newValue = translateX.value + e.changeX;
      if (newValue < 0) {
        translateX.value = 0;
      } else if (newValue > trackLength - 60) {
        translateX.value = trackLength - 60;
      } else {
        translateX.value = newValue;
      }
    })
    .onEnd(() => {
      if (translateX.value !== trackLength - 60) {
        translateX.value = withTiming(0);
        textOpacity.value = withTiming(1);
      } else {
        runOnJS(setActive)(false);
        runOnJS(onConfirm)();
      }
    });
  return (
    <View
      style={{
        width: '100%',
        height: 50,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 10,
        flexDirection: 'row',
      }}
      onLayout={(e) => {
        setTrackLength(e.nativeEvent.layout.width);
      }}
    >
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              height: 50,
              width: 60,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: colors.primary500,
              borderWidth: 1,
              flexDirection: 'row',
              zIndex: 2,
              backgroundColor: colors.backgroundSecondary,
            },
            animatedStyle,
          ]}
        >
          {loading ? (
            <LoadingSpinner size={24} />
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <Ionicons name="chevron-forward" size={20} color={colors.primary500} />
            </View>
          )}
        </Animated.View>
      </GestureDetector>
      <Animated.View
        style={[
          { flex: 1, justifyContent: 'center', zIndex: 1 },
          animatedTextStyle,
        ]}
      >
        <Text style={globalStyles.textBodyG}>Slide to confirm</Text>
      </Animated.View>
    </View>
  );
};

export default SwipeToConfirm;
