import { View, Text, useWindowDimensions, FlatList } from 'react-native';
import React, { useCallback } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, globalStyles } from '../../../styles';
import useUser from '../../../hooks/useUser';
import { useNavigation } from '@react-navigation/native';
import { useParseContent, useZapNote } from '../../../hooks';
import { getAge } from '../../../utils';
import PostActionBar from '../../../components/Posts/PostActionBar';
import { useDispatch } from 'react-redux';
import { addLike, removeLike } from '../../interactionSlice';
import { publishReaction } from '../../../utils/nostrV2';
import useInteractions from '../../../hooks/useInteractions';
import UserBanner from '../../homefeed/components/UserBanner';
import { Image } from 'expo-image';
import Kind1Note from '../../../models/Kind1Note';

type CommentProps = {
  event: Kind1Note;
  small?: boolean;
  onMenu: (event) => void;
};

const Comment = ({ event, small, onMenu }: CommentProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();

  const user = useUser(event.pubkey);
  const content = useParseContent(event);
  const { isLiked } = useInteractions(event.id);

  const commentHandler = () => {
    //@ts-ignore
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
        flex: 1,
        width: '100%',
      }}
    >
      <View style={{ flex: 1 }}>
      </View>
      <UserBanner
        user={user}
        event={event}
        width={small ? (width / 100) * 70 : width}
      />
      <Text
        style={[globalStyles.textBody, { textAlign: 'left', marginTop: 16 }]}
      >
        {content}
      </Text>
      {event.images.length > 0 ? (
        <FlatList
          data={event.images}
          horizontal
          renderItem={({ item }) => (
            <Image source={item} style={{ height: width / 2, width: width / 2, borderRadius: 10 }} />
          )}
          contentContainerStyle={{borderRadius: 10, padding: 10, borderColor: colors.backgroundSecondary, borderWidth: 1, marginTop: 12}}
        />
      ) : undefined}
      <PostActionBar
        //@ts-ignore
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
};

export default Comment;
