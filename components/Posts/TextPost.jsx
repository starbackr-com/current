import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getAge } from '../../features/shared/utils/getAge';
import { useDispatch } from 'react-redux';
import { useParseContent } from '../../hooks/useParseContent';
import PostActionBar from './PostActionBar';
import { globalStyles } from '../../styles';
import { useZapNote } from '../../hooks';
import { addLike, removeLike } from '../../features/interactionSlice';
import { publishReaction } from '../../utils/nostrV2';
import useInteractions from '../../hooks/useInteractions';

const TextPost = React.memo(({ event, user, onMenu }) => {
  const content = useParseContent(event);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {isLiked} = useInteractions(event.id);

  const commentHandler = () => {
    navigation.push('CommentScreen', {
      eventId: event.id,
      rootId: event.id,
      type: 'root',
      event,
    });
  };
  const zapHandler = useZapNote(
    event.id,
    user?.lud16 || user?.lud06,
    user?.name || event?.pubkey.slice(0, 16),
    event.pubkey,
  );

  const likeHandler = useCallback(async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch(addLike([event.id]));
      await publishReaction('+', event.id, event.pubkey);
    } catch (e) {
      dispatch(removeLike(event.id));
      console.log(e);
    }
  }, [dispatch, event]);

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        padding: 6,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={[
            globalStyles.textBodyBold,
            { textAlign: 'left', width: '50%' },
          ]}
          numberOfLines={1}
          onPress={() => {
            navigation.navigate('Profile', {
              screen: 'ProfileScreen',
              params: { pubkey: event.pubkey },
            });
          }}
        >
          {user?.name || event.pubkey}
        </Text>
        <Text style={[globalStyles.textBodyS]}>{getAge(event.created_at)}</Text>
      </View>

      <Text
        style={[globalStyles.textBody, { textAlign: 'left', marginTop: 16 }]}
      >
        {content}
      </Text>
      <PostActionBar
        onPressComment={commentHandler}
        onPressMore={() => {
          onMenu(event);
        }}
        onPressZap={zapHandler}
        zapDisabled={!user?.lud06 && !user?.lud16}
        onPressLike={likeHandler}
        isLiked={isLiked}
      />
    </Animated.View>
  );
});

export default TextPost;
