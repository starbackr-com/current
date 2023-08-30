import { View, Text } from 'react-native';
import React, { useCallback } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { globalStyles } from '../../../styles';
import useUser from '../../../hooks/useUser';
import { useNavigation } from '@react-navigation/native';
import { useParseContent, useZapNote } from '../../../hooks';
import { getAge } from '../../../utils';
import PostActionBar from '../../../components/Posts/PostActionBar';
import { useDispatch } from 'react-redux';
import { addLike, removeLike } from '../../interactionSlice';
import { publishReaction } from '../../../utils/nostrV2';
import useInteractions from '../../../hooks/useInteractions';

const Comment = ({event}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const user = useUser(event.pubkey);
  const content = useParseContent(event)
  const {isLiked} = useInteractions(event.id);

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
            //@ts-ignore
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
      //@ts-ignore
        onPressComment={commentHandler}
        // onPressMore={() => {
        //   onMenu(event);
        // }}
        onPressZap={zapHandler}
        zapDisabled={!user?.lud06 && !user?.lud16}
        onPressLike={likeHandler}
        isLiked={isLiked}
      />
    </Animated.View>
  );
};

export default Comment;
