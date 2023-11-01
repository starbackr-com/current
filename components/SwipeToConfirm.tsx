import { View, Text } from 'react-native';
import React, { useState } from 'react';
import {
  Gesture,
  GestureDetector,
  Swipeable,
} from 'react-native-gesture-handler';
import Animated, {
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
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const pan = Gesture.Pan()
    .enabled(active)
    .onChange((e) => {
      const newValue = translateX.value + e.changeX;
      if (newValue < 0) {
        translateX.value = 0;
      } else if (newValue > trackLength - 120) {
        translateX.value = trackLength - 120;
      } else {
        translateX.value = newValue;
      }
    })
    .onEnd(() => {
      if (translateX.value !== trackLength - 120) {
        translateX.value = withTiming(0);
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
              width: 120,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: colors.primary500,
              borderWidth: 1,
              flexDirection: 'row',
            },
            animatedStyle,
          ]}
        >
          {loading ? (
            <LoadingSpinner size={24} />
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Text style={globalStyles.textBodyBold}>Confirm</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default SwipeToConfirm;
