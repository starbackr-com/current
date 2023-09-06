import { useNavigation } from '@react-navigation/native';
import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
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

const TextPost = React.memo(({ item, height, width, onMenu }) => {
  const navigation = useNavigation();
  const user = useUser(item.pubkey);
  const [hasMore, setHasMore] = useState(false);
  const [numOfLines, setNumOfLines] = useState<number>();
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
    const containerHeight = (((height / 100) * 90) / 100) * 90;
    const maxLines = containerHeight / lineHeight;
    const numOfLines = e.nativeEvent.lines.length;
    if (numOfLines > maxLines - 5) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
    setNumOfLines(maxLines - 5);
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
        <View
          style={{
            backgroundColor: colors.backgroundSecondary,
            flex: 1,
            height: '100%',
            padding: 12,
            borderRadius: 10,
            justifyContent: 'space-between',
          }}
        >
          <View>
            <UserBanner
              event={item}
              user={user}
              width={((width - 16) / 100) * 85}
            />
            <Text
              onTextLayout={textLayout}
              style={[
                globalStyles.textBody,
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
                globalStyles.textBody,
                {
                  textAlign: 'left',
                },
              ]}
              numberOfLines={numOfLines}
            >
              {content}
            </Text>
            {hasMore && (
              <Pressable
                onPress={() => {
                  navigation.navigate('ReadMoreModal', {
                    event: item,
                    author: user?.name || pubkey,
                  });
                }}
              >
                <Text
                  style={[
                    globalStyles.textBodyS,
                    {
                      color: colors.primary500,
                      textAlign: 'left',
                    },
                  ]}
                >
                  {readMoreText}
                </Text>
              </Pressable>
            )}
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={[
                globalStyles.textBodyS,
                { textAlign: 'right', padding: 4, color: 'white' },
              ]}
            >
              {age}
            </Text>
          </View>
        </View>
        <ActionBar user={user} event={item} width={width} onMenu={onMenu} isZapped={isZapped}/>
      </Animated.View>
    </View>
  );
});

export default TextPost;
