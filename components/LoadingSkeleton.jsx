import React from 'react';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const LoadingSkeleton = () => {
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true,
    ),
  }));
  return (
    <Animated.View
      style={[{ backgroundColor: '#333333', flex: 1, borderRadius: 10 }, pulseStyle]}
    />
  );
};

export default LoadingSkeleton;
