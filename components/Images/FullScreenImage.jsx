import { View } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';

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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../styles';
import { downloadFileAndGetUri } from '../../utils/files';
import CustomButton from '../CustomButton';

const FullScreenImage = ({ route, navigation }) => {
  const imageUri = route?.params?.imageUri;

  const [shareIsLoading, setShareIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

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

  const shareHandler = async () => {
    setShareIsLoading(true);
    try {
      const uri = await downloadFileAndGetUri(imageUri[0]);
      Sharing.shareAsync(uri);
    } catch (e) {
      console.log(e);
    } finally {
      setShareIsLoading(false);
    }
  };

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
            source={imageUri}
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
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          backgroundColor: colors.backgroundPrimary,
          paddingBottom: insets.bottom || 12,
          padding: 12,
          gap: 10,
          flexDirection: 'row',
          opacity: 0.8,
        }}
      >
        <View style={{ flex: 1 }}>
          <CustomButton
            text="Remix"
            icon="color-wand"
            buttonConfig={{
              onPress: () => {
                navigation.navigate('DVM', {
                  screen: 'ImageGen',
                  params: { remixImg: imageUri[0] },
                });
              },
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomButton
            text="Share"
            icon="share"
            buttonConfig={{ onPress: shareHandler }}
            loading={shareIsLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default FullScreenImage;
