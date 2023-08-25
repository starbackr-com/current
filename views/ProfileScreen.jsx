/* eslint-disable react/no-unstable-nested-components */
import { View } from 'react-native';
import React, { useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';

import { useSubscribeEvents } from '../hooks';
import { ImagePost, TextPost } from '../components/Posts';
import { colors, globalStyles } from '../styles';
import ProfileInfo from '../features/profile/components/ProfileInfo';
import PostMenuBottomSheet from '../components/PostMenuBottomSheet';

const ProfileScreen = ({ route }) => {
  const { pubkey } = route.params;
  const users = useSelector((state) => state.messages.users);
  const [width, setWidth] = useState();

  const listRef = useRef();

  const modalRef = useRef();

  const loggedInPubkey = useSelector((state) => state.auth.pubKey);

  const events = useSubscribeEvents(pubkey);

  const user = users[pubkey];

  const onLayoutViewWidth = (e) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const handlePresentModalPress = (data) => {
    modalRef.current?.present(data);
  };

  const renderItem = ({ item }) => {
    if (item.type === 'image') {
      return <ImagePost event={item} user={user} width={width} onMenu={handlePresentModalPress} />;
    }
    if (item.type === 'text') {
      return <TextPost event={item} user={user} width={width} onMenu={handlePresentModalPress} />;
    }
    return undefined;
  };

  return (
    <View
      style={[
        globalStyles.screenContainer,
        { paddingTop: 0, paddingHorizontal: 0 },
      ]}
    >
      <View
        style={{
          flex: 1,
          width: '100%',
        }}
        onLayout={onLayoutViewWidth}
      >
        <FlashList
          data={events}
          renderItem={renderItem}
          ListHeaderComponent={(
            <ProfileInfo
              user={user}
              pubkey={pubkey}
              loggedInPubkey={loggedInPubkey}
            />
  )}
          extraData={users}
          estimatedItemSize={250}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: colors.backgroundSecondary,
                width: '100%',
                marginVertical: 5,
              }}
            />
          )}
          ref={listRef}
          keyExtractor={(item) => item.id}
        />
        <View style={{ height: 36 }} />
      </View>
      <PostMenuBottomSheet ref={modalRef} />
    </View>
  );
};

export default ProfileScreen;
