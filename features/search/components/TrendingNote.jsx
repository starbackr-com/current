import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParseContent } from '../../../hooks';
import { colors, globalStyles } from '../../../styles';
import UserBanner from '../../homefeed/components/UserBanner';
import ActionBar from '../../homefeed/components/ActionBar';
import PostActionBar from '../../../components/Posts/PostActionBar';

const style = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    marginVertical: 12
  }
})

const TrendingNote = ({ event }) => {
  const [viewWidth, setViewWidth] = useState();
  const content = useParseContent(event);
  const user = useSelector((state) => state.messages.users[event.pubkey]);

  return (
    <View
      onLayout={(e) => {
        setViewWidth(e.nativeEvent.layout.width);
      }}
      style={style.container}
    >
      {viewWidth ? (
        <UserBanner user={user} event={event} width={viewWidth} />
      ) : undefined}
      <Text
        style={[globalStyles.textBody, {textAlign: 'left'}]}
        numberOfLines={event.content.length > 100 ? 10 : undefined}
      >
        {content}
      </Text>
      {viewWidth ? <PostActionBar/> : undefined}
    </View>
  );
};

export default TrendingNote;
