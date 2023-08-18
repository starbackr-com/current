import React, { useState } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useParseContent, useZapNote } from '../../../hooks';
import { colors, globalStyles } from '../../../styles';
import UserBanner from '../../homefeed/components/UserBanner';
import PostActionBar from '../../../components/Posts/PostActionBar';
import { publishReaction } from '../../../utils/nostrV2';
import { addLike } from '../../interactionSlice';

const style = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    marginVertical: 12,
  },
});

const TrendingNote = ({ event, onMenu }) => {
  const [viewWidth, setViewWidth] = useState();
  const content = useParseContent(event);
  const user = useSelector((state) => state.messages.users[event.pubkey]);
  const likedEvents = useSelector((state) => state.interaction.likedEvents);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const zap = useZapNote(
    event.id,
    user?.lud16 || user?.lud06,
    user?.name || event?.pubkey.slice(0, 16),
    event.pubkey,
  );

  return (
    <Pressable
      onLayout={(e) => {
        setViewWidth(e.nativeEvent.layout.width);
      }}
      style={style.container}
      onPress={() => {
        navigation.push('CommentScreen', { eventId: event.id });
      }}
    >
      {viewWidth ? (
        <UserBanner user={user} event={event} width={viewWidth} />
      ) : undefined}
      <Text
        style={[globalStyles.textBody, { textAlign: 'left' }]}
        numberOfLines={event.content.length > 100 ? 10 : undefined}
      >
        {content}
      </Text>
      <PostActionBar
        onPressZap={zap}
        onPressMore={() => {
          onMenu(event);
        }}
        onPressLike={() => {
          publishReaction('+', event.id, event.pubkey);
          dispatch(addLike([event.id]));
        }}
        isLiked={likedEvents.includes(event.id)}
      />
    </Pressable>
  );
};

export default TrendingNote;
