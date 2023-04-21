import { Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabBarHeaderLeft = () => {
  const navigation = useNavigation();
  const pk = useSelector((state) => state.auth.pubKey);
  const user = useSelector((state) => state.messages.users[pk]);
  return (
    <Pressable
      style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
      }}
      onPress={() => {
        navigation.navigate('Profile', {
          screen: 'ProfileScreen',
          params: { pubkey: pk, name: user?.name || undefined },
        });
      }}
    >
      {user?.picture ? (
        <Image
          source={user?.picture}
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
          }}
        />
      ) : (
        <Ionicons name="person-circle-outline" color="white" size={24} />
      )}
    </Pressable>
  );
};

export default TabBarHeaderLeft;
