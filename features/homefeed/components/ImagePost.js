import { useNavigation } from '@react-navigation/native';
import { View, Text, Pressable } from 'react-native';
import colors from '../../../styles/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useCallback } from 'react';
import Animated, {
  withTiming,
  useAnimatedStyle,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import globalStyles from '../../../styles/globalStyles';
import { Image } from 'expo-image';
import reactStringReplace from 'react-string-replace';
import { getAge } from '../../shared/utils/getAge';
import UserBanner from './UserBanner';
import ActionBar from './ActionBar';
import { useIsZapped } from '../../zaps/hooks/useIsZapped';

const FeedImage = ({ size, images }) => {
  const navigation = useNavigation();
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  return (
    <Pressable
      style={{ width: size, flex: 1 }}
      onPress={() => {
        navigation.navigate('ImageModal', { imageUri: images });
      }}
    >
      <Image
        source={images[0]}
        style={{ width: size, flex: 1 }}
        contentFit="cover"
        recyclingKey={images[0][0]}
      />
      {images.length > 1 ? (
        <Text
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: colors.primary500,
          }}
        >{`+${images.length - 1}`}</Text>
      ) : undefined}
    </Pressable>
  );
};

const ImagePost = React.memo(({ item, height, width, user, zaps }) => {
  const navigation = useNavigation();
  const [hasMore, setHasMore] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [numOfLines, setNumOfLines] = useState(NUM_LINES);
  const readMoreText = showMore ? 'Show Less' : 'Read More...';

  const parseMentions = useCallback((event) => {
    if (event.mentions.length < 1) {
      return event.content;
    }
    let content = event.content;
    content = reactStringReplace(content, /#\[([0-9]+)]/, (m, i) => {
      return (
        <Text
          style={{ color: colors.primary500 }}
          onPress={() => {
            navigation.navigate('Profile', {
              screen: 'ProfileScreen',
              params: { pubkey: event.tags[i - 1][1] },
            });
          }}
          key={i}
        >
          {event.mentions[i - 1]?.mention}
        </Text>
      );
    });
    return content;
  }, []);

  const { created_at, pubkey } = item;

  const age = getAge(created_at);

  const NUM_LINES = 2;
  let { content } = item;

  if (item.mentions) {
    content = parseMentions(item);
  }

  const textLayout = (e) => {
    setHasMore(e.nativeEvent.lines.length > NUM_LINES);
    setNumOfLines(e.nativeEvent.lines.length);
  };

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

  return (
    <View
      style={{
        height: (height / 100) * 90,
        width: width - 16,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            marginBottom: 16,
            width: '85%',
            height: '90%',
            borderRadius: 10,
            backgroundColor: colors.backgroundSecondary,
            justifyContent: 'space-between',
            borderWidth: 1,
            overflow: 'hidden',
          },
          backgroundStyle,
        ]}
      >
        <View
          style={{
            backgroundColor: colors.backgroundSecondary,
            padding: 12,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomWidth: 1,
            borderColor: colors.primary500,
          }}
        >
          <UserBanner event={item} user={user} width={width} />
        </View>
        <FeedImage size={((width - 16) / 100) * 85} images={[item.image]} />
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: colors.backgroundSecondary,
              padding: 12,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderTopWidth: 1,
              borderColor: colors.primary500,
            },
            pressed && hasMore ? { backgroundColor: '#333333' } : undefined,
          ]}
          onPress={
            hasMore
              ? () => {
                  navigation.navigate('ReadMoreModal', {
                    event: item,
                    author: user?.name || pubkey,
                  });
                }
              : undefined
          }
        >
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
            numberOfLines={
              !hasMore ? NUM_LINES : showMore ? numOfLines : NUM_LINES
            }
          >
            {content}
          </Text>
          {hasMore && (
            <View>
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
            </View>
          )}
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {zaps ? (
              <Pressable
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={[
                    globalStyles.textBodS,
                    {
                      textAlign: 'left',
                      color: colors.primary500,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}
                >
                  <Ionicons
                    name="flash-outline"
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />{' '}
                  {zaps.amount}
                </Text>
              </Pressable>
            ) : (
              <View></View>
            )}
            <Text
              style={[
                globalStyles.textBodyS,
                { textAlign: 'right', padding: 4 },
              ]}
            >
              {age}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
      <ActionBar user={user} event={item} width={width} />
    </View>
  );
});

export default ImagePost;
