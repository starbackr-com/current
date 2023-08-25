/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable global-require */
import { View, Text, Pressable, Alert } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { unmuteUser } from '../../../utils/users';
import { colors, globalStyles } from '../../../styles';

const UserCard = ({ pk }) => {
  const user = useSelector((state) => state.messages.users[pk]) || {};

  const unmuteHandler = async () => {
    Alert.alert(
      'Un-Mute',
      `Do you want to un-mute ${user.name || pk.slice(0, 16)}?`,
      [
        {
          text: 'Yes!',
          onPress: async () => {
            await unmuteUser(pk);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.backgroundSecondary,
        padding: 6,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
      }}
      onPress={unmuteHandler}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={user.picture || require('../../../assets/user_placeholder.jpg')}
      />
      <Text style={globalStyles.textBody}>{user.name || pk.slice(0, 16)}</Text>
    </Pressable>
  );
};

const UserSettingsScreen = () => {
  const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);
  const renderItem = ({ item }) => <UserCard pk={item} />;
  return (
    <View
      style={[globalStyles.screenContainerScroll, { alignItems: 'center' }]}
    >
      <Text style={globalStyles.textBodyBold}>Muted Users</Text>
      <Text style={globalStyles.textBodyS}>Click to un-mute</Text>
      {mutedPubkeys.length > 0 ? (
        <View style={{ width: '90%', marginTop: 32, flex: 1 }}>
          <FlashList
            data={mutedPubkeys}
            renderItem={renderItem}
            estimatedItemSize={80}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        </View>
      ) : (
        <Text style={[globalStyles.textBodyBold, { marginTop: 32 }]}>
          No Muted Users
        </Text>
      )}
    </View>
  );
};

export default UserSettingsScreen;
