import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getAge } from '../../features/shared/utils/getAge';
import { useParseContent } from '../../hooks/useParseContent';
import PostActionBar from './PostActionBar';
import { globalStyles } from '../../styles';

const TextPost = React.memo(({ event, user, onMenu }) => {
  const content = useParseContent(event);
  const navigation = useNavigation();
  const commentHandler = () => {
    navigation.push('CommentScreen', {
      eventId: event.id,
      rootId: event.id,
      type: 'root',
      event,
    });
  };

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
      />
    </Animated.View>
  );
});

export default TextPost;
