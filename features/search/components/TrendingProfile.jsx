import React, { useState } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { colors, globalStyles } from '../../../styles';
import UserBanner from '../../homefeed/components/UserBanner';
import { CustomButton } from '../../../components';
import { useFollowUser, useIsFollowed, useUnfollowUser } from '../../../hooks';

const style = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    marginVertical: 12,
  },
});

function parseAbout(event) {
  try {
    const bio = JSON.parse(event.content);
    return bio.about;
  } catch (e) {
    console.log(e);
    return '';
  }
}

const TrendingProfile = ({ event }) => {
  const [viewWidth, setViewWidth] = useState();
  const user = useSelector((state) => state.messages.users[event.pubkey]);
  const isFollowed = useIsFollowed(event.pubkey);
  const { follow } = useFollowUser();
  const { unfollow } = useUnfollowUser();
  const navigation = useNavigation();

  return (
    <Pressable
      onLayout={(e) => {
        setViewWidth(e.nativeEvent.layout.width);
      }}
      style={style.container}
      onPress={() => {
        navigation.push('Profile', {
          screen: 'ProfileScreen',
          params: {
            pubkey: event.pubkey,
          },
        });
      }}
    >
      {viewWidth ? (
        <UserBanner user={user} event={event} width={viewWidth} />
      ) : undefined}
      <Text
        style={[globalStyles.textBody, { textAlign: 'left', marginBottom: 12 }]}
        numberOfLines={event.content.length > 100 ? 10 : undefined}
      >
        {parseAbout(event)}
      </Text>
      <CustomButton
        text={isFollowed ? 'Unfollow' : 'Follow'}
        icon={isFollowed ? 'person-remove' : 'person-add'}
        buttonConfig={{
          onPress: () => {
            if (isFollowed) {
              unfollow([event.pubkey]);
            } else {
              follow([event.pubkey]);
            }
          },
        }}
      />
    </Pressable>
  );
};

export default TrendingProfile;
