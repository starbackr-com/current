import { useNavigation } from '@react-navigation/native';
import { View, Text, Pressable } from 'react-native';
import React, { useMemo, useState } from 'react';
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
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const FullImagePost = ({ item, height, width, onMenu }) => {
  const navigation = useNavigation();
  const [imageDim, setImageDim] = useState();
  const user = useUser(item.pubkey);
  const [hasMore, setHasMore] = useState(false);

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
  const age = useMemo(() => getAge(created_at), []);

  const textLayout = (e) => {
    const maxLines = 2;
    const numOfLines = e.nativeEvent.lines.length;
    if (numOfLines > maxLines) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
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
            borderRadius: 10,
          }}
          onLayout={(e) => {
            setImageDim({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            });
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
            console.log(item.image);
            navigation.navigate('ImageModal', { imageUri: item.image });
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
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={{ height: '25%', justifyContent: 'flex-end' }}
          >
            <Pressable
              onPress={() => {
                navigation.navigate('ReadMoreModal', {
                  event: item,
                  author: user.name || item.pubkey,
                });
              }}
              style={{ width: '85%' }}
            >
              <View
                style={{
                  // backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: 12,
                  borderRadius: 10,
                  width: '100%',
                }}
              >
                <Text style={[globalStyles.textBodyS, { textAlign: 'left' }]}>
                  {age}
                </Text>
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
          </LinearGradient>
        </Pressable>
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 'auto',
            bottom: 'auto',
          }}
        >
          <ActionBar user={user} event={item} width={width} onMenu={onMenu} />
        </View>
      </Animated.View>
    </View>
  );
};

export default FullImagePost;
