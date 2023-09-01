import { View, Text, useWindowDimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../../styles/globalStyles';
import useStatus from '../../../hooks/useStatus';

const placeholder = require('../../../assets/user_placeholder.jpg');

const UserBanner = ({ user, event, width }) => {
  const imageDimensions = (width / 100) * 12;
  const navigation = useNavigation();
  const [status, statusLoading] = useStatus(event.pubkey);

  let userStatus;
  if (statusLoading) {
    userStatus = 'Loading...';
  }
  if (!statusLoading) {
    userStatus = status?.content || '';
  }

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        width: '100%',
      }}
      onPress={() => {
        navigation.navigate('Profile', {
          screen: 'ProfileScreen',
          params: {
            pubkey: event.pubkey,
            name: user?.name || event.pubkey.slice(0, 16),
          },
        });
      }}
    >
      <Image
        source={user?.picture || placeholder}
        style={{
          width: imageDimensions,
          height: imageDimensions,
          borderRadius: imageDimensions / 2,
        }}
        recyclingKey={event.pubkey}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[globalStyles.textBodyBold, { textAlign: 'left' }]} ellipsizeMode='tail' numberOfLines={1}>
          {user?.name || event.pubkey.slice(0, 16)}
        </Text>
        <Text style={[globalStyles.textBodyS, { textAlign: 'left' }]}>
          {userStatus}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserBanner;
