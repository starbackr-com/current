import { useNavigation } from '@react-navigation/native';
import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  withTiming,
  useAnimatedStyle,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import { useParseContent } from '../../../hooks/useParseContent';
import { getAge } from '../../shared/utils/getAge';
import UserBanner from './UserBanner';
import { useIsZapped } from '../../zaps/hooks/useIsZapped';
import ActionBar from './ActionBar';
import { colors, globalStyles } from '../../../styles';
import useUser from '../../../hooks/useUser';
import FeedImage from '../../../components/Images/FeedImage';
import { Image } from 'expo-image';

const FullImagePost = ({ item, height, width, onMenu }) => {
  const NUM_LINES = 2;

  const navigation = useNavigation();
  const [imageDim, setImageDim] = useState();
  const user = useUser(item.pubkey);
  const [showMore, setShowMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [numOfLines, setNumOfLines] = useState<number>(NUM_LINES);
  const readMoreText = 'Read More...';

  const isZapped = useIsZapped(item.id);

  const bgProgress = useDerivedValue(() => withTiming(isZapped ? 1 : 0));

  const backgroundStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      bgProgress.value,
      [0, 1],
      ['#222222', colors.primary500],
    );

    return { borderColor };
  });

  const content = useParseContent(item);

  const { created_at, pubkey } = item;
  const age = getAge(created_at);

  const textLayout = (e) => {
    const lineHeight = e.nativeEvent.lines[0]?.height || 16;
    const containerHeight = 32;
    const maxLines = 2;
    const numOfLines = e.nativeEvent.lines.length;
    console.log(numOfLines);
    if (numOfLines > maxLines) {
      setHasMore(true);
      console.log('true');
    } else {
      setHasMore(false);
    }
    setNumOfLines(2);
  };

  return (
    <View
      style={{
        height: height,
        width: width,
        padding: 5,
      }}
    >
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            height: '100%',
            width: '100%',
            backgroundColor: colors.backgroundSecondary,
            alignItems: 'center',
            borderRadius: 10,
            borderWidth: 1,
          },
          backgroundStyle,
        ]}
      >
        <Pressable
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'red',
            borderRadius: 10,
          }}
          onLayout={(e) => {
            setImageDim({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            });
          }}
          onPress={() => {
            console.log('pressed')
            navigation.navigate('ImageModal', { imageUri: [item.image] });
          }}
        >
          {imageDim ? (
            <Image
              source={item.image}
              style={{
                width: imageDim.width,
                height: imageDim.height,
                borderRadius: 10,
              }}
            />
          ) : undefined}
        </Pressable>
        <Pressable
          style={{
            position: 'absolute',
            flex: 1,
            height: '100%',
            width: '100%',
            borderRadius: 10,
            justifyContent: 'space-between',
          }}
          onPress={() => {
            console.log('pressed')
            navigation.navigate('ImageModal', { imageUri: [item.image] });
          }}
        >
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 12,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <UserBanner
              event={item}
              user={user}
              width={((width - 16) / 100) * 85}
            />
          </View>
          <View style={{ width: '100%', alignItems: 'flex-end', opacity: 0.8 }}>
            <ActionBar user={user} event={item} width={width} onMenu={onMenu} />
          </View>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 12,
              borderRadius: 10,
            }}
          >
            <Text
              onTextLayout={textLayout}
              style={[
                globalStyles.textBodyS,
                {
                  opacity: 0,
                  position: 'absolute',
                },
              ]}
            >
              {content}
            </Text>
            <Text
              style={[
                globalStyles.textBodyS,
                {
                  textAlign: 'left',
                },
              ]}
              numberOfLines={2}
            >
              {content}
            </Text>
            {hasMore && (
              <Text
                style={[
                  globalStyles.textBodyS,
                  {
                    color: colors.primary500,
                    textAlign: 'left',
                  },
                ]}
              >
                Read more...
              </Text>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default FullImagePost;
