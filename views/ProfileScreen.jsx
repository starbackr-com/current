import { View, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

import { getUserData } from '../utils/nostrV2';
import { encodePubkey } from '../utils/nostr/keys';
import CustomButton from '../components/CustomButton';
import { useFollowUser, useUnfollowUser, useSubscribeEvents } from '../hooks';
import { ImagePost, TextPost } from '../components/Posts';
import { colors, globalStyles } from '../styles';
import BadgeBar from '../features/badges/components/BadgeBar';
import { SuccessToast } from '../components';

const ProfileHeader = ({ pubkey, user, loggedInPubkey }) => {
  const [verified, setVerified] = useState(false);
  const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
  const badges = useSelector((state) => state.messages.userBadges[pubkey]);
  const { badgeDefinitions = [] } = badges || {};
  const { unfollow } = useUnfollowUser();
  const { follow } = useFollowUser();

  const verifyNip05 = async (pubkey, nip05) => {
    try {
      const [name, domain] = nip05.split('@');
      const response = await fetch(
        `https://${domain}/.well-known/nostr.json?name=${name}`,
      );
      const data = await response.json();
      if (Object.values(data.names).includes(pubkey)) {
        setVerified(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserData([pubkey]);
    if (user && user?.nip05) {
      verifyNip05(user.pubkey, user.nip05);
    }
  }, []);

  const copyHandler = async () => {
    await Clipboard.setStringAsync(npub);
    Toast.show(<SuccessToast text="Copied!" />, {
      duration: Toast.durations.SHORT,
      position: -100,
      backgroundColor: 'green',
    });
  };

  const npub = encodePubkey(pubkey) || 'npub100000000000000000';
  return (
    <View style={{ width: '100%' }}>
      <View style={{ padding: 12, width: '100%' }}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 12,
          }}
        >
          <Image
            style={{
              width: 74,
              height: 74,
              borderRadius: 37,
              borderColor: colors.primary500,
              borderWidth: 1,
            }}
            source={user?.picture || require('../assets/user_placeholder.jpg')}
          />
          <View style={{ padding: 12 }}>
            {pubkey === loggedInPubkey ? (
              <Text
                style={[
                  globalStyles.textBodyS,
                  {
                    color: colors.primary500,
                    textAlign: 'left',
                  },
                ]}
                onPress={() => {}}
              >{`${followedPubkeys.length} following`}</Text>
            ) : undefined}
            <Text
              style={[
                globalStyles.textBody,
                { color: colors.primary500, textAlign: 'left' },
              ]}
            >
              {user?.nip05}{' '}
              <Ionicons name={verified ? 'checkbox' : 'close-circle'} />{' '}
            </Text>
            <Text
              style={[
                globalStyles.textBody,
                { color: colors.primary500, textAlign: 'left' },
              ]}
            >
              {user?.lud16} <Ionicons name={user?.lud16 ? 'flash' : ''} />{' '}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <BadgeBar badgeDefinition={badgeDefinitions} />
          <View style={{ flex: 1 }} />
        </View>
        <View>
          <Text style={[globalStyles.textBody, { textAlign: 'left' }]}>
            {user?.about}
          </Text>
          <Text
            style={[
              globalStyles.textBodyS,
              {
                textAlign: 'left',
                color: 'grey',
                marginBottom: 24,
              }
            ]}
            onPress={copyHandler}
          >
            {`${npub.slice(0, 32)}...`}
            <Ionicons name="clipboard" />
          </Text>
          {loggedInPubkey !== pubkey ? (
            !followedPubkeys.includes(pubkey) ? (
              <CustomButton
                text="Follow"
                buttonConfig={{
                  onPress: () => {
                    follow([pubkey]);
                  },
                }}
              />
            ) : (
              <CustomButton
                text="Unfollow"
                buttonConfig={{
                  onPress: () => {
                    unfollow(pubkey);
                  },
                }}
              />
            )
          ) : undefined}
        </View>
      </View>
    </View>
  );
};

const ProfileScreen = ({ route }) => {
  const { pubkey } = route.params;
  const users = useSelector((state) => state.messages.users);
  const [width, setWidth] = useState();

  const listRef = useRef();

  const loggedInPubkey = useSelector((state) => state.auth.pubKey);

  const events = useSubscribeEvents(pubkey);

  const user = users[pubkey];

  const onLayoutViewWidth = (e) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const renderItem = ({ item }) => {
    if (item.type === 'image') {
      return <ImagePost event={item} user={user} width={width} />;
    } else if (item.type === 'text') {
      return <TextPost event={item} user={user} width={width} />;
    }
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
          ListHeaderComponent={
            <ProfileHeader
              user={user}
              pubkey={pubkey}
              loggedInPubkey={loggedInPubkey}
            />
          }
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
        <View style={{ height: 36 }}></View>
      </View>
    </View>
  );
};

export default ProfileScreen;
