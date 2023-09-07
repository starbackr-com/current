import { Pressable, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import * as FileSystem from 'expo-file-system';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../styles';

const FullScreenImage = ({ route, navigation }) => {
  const imageUri = route?.params?.imageUri;

  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const gestureScale = useSharedValue(1);
  const focalY = useSharedValue(0);
  const focalX = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onChange((event) => {
      gestureScale.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    })
    .onEnd(() => {
      gestureScale.value = withTiming(1, { duration: 200 });
    });

  const fling = Gesture.Fling()
    .direction(Directions.DOWN)
    .numberOfPointers(1)
    .runOnJS(true)
    .onEnd(() => {
      navigation.goBack();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: focalX.value },
      { translateY: focalY.value },
      { translateX: -imageDimensions.width / 2 },
      { translateY: -imageDimensions.height / 2 },
      { scale: gestureScale.value },
      { translateX: -focalX.value },
      { translateY: -focalY.value },
      { translateX: imageDimensions.width / 2 },
      { translateY: imageDimensions.height / 2 },
    ],
  }));

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        overflow: 'hidden',
      }}
    >
      <GestureDetector gesture={Gesture.Race(fling, pinch)}>
        <Animated.View
          style={[
            {
              flex: 1,
            },
            animatedStyle,
          ]}
          onLayout={({ nativeEvent }) => {
            setImageDimensions({
              height: nativeEvent.layout.height,
              width: nativeEvent.layout.width,
            });
          }}
        >
          <Image
            style={{ width: '100%', flex: 1 }}
            source={imageUri[0]}
            contentFit="contain"
          />
        </Animated.View>
      </GestureDetector>
      <Ionicons
        name="close"
        size={32}
        color="white"
        onPress={() => {
          navigation.goBack();
        }}
        style={{ position: 'absolute', top: 12, right: 12 }}
      />
      <Pressable
        style={{
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.3)',
          position: 'absolute',
          bottom: 0,
          marginBottom: 50,
          paddingVertical: 32,
        }}
        onPress={async () => {
          console.log(`${FileSystem.cacheDirectory}${Date.now()}`);
          // const uri = await FileSystem.downloadAsync(
          //   imageUri,
          //   `${FileSystem.cacheDirectory}${Date.now()}`,
          // );
          // console.log(uri);
        }}
      >
        <Text style={globalStyles.textBody}>Save Image</Text>
      </Pressable>
    </View>
  );
};

export default FullScreenImage;
