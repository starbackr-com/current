import { Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { colors, globalStyles } from '../styles';
import { getValue } from '../utils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary,
    width: '100%',
    borderBottomColor: '#333333',
    borderBottomWidth: 1,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
  },
});

const UserSearchResultItem = ({ userData }) => {
  const navigation = useNavigation();
  const pressHandler = async () => {
    const sk = await getValue('privKey');
    navigation.navigate('Chat', { pk: userData.pubkey, sk });
  };

  return (
    <Pressable
      style={[styles.container]}
      onPress={pressHandler}
    >
      <Image source={userData.picture} style={styles.image} />
      <Text style={globalStyles.textBody}>{userData.name}</Text>
    </Pressable>
  );
};

export default UserSearchResultItem;
