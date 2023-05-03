import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { colors, globalStyles } from '../../../styles';

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

const ResultItem = ({ userData }) => {
  const navigation = useNavigation();
  const pressHandler = () => {
    navigation.navigate('Profile', {
      screen: 'ProfileScreen',
      params: {
        pubkey: userData.pubkey,
        name: userData?.name || userData.pubkey.slice(0, 16),
      },
    });
  };

  return (
    <Pressable style={styles.container} onPress={pressHandler}>
      <Image source={userData.picture} style={styles.image} transition={300} />
      <Text style={globalStyles.textBody}>{userData.name}</Text>
    </Pressable>
  );
};

export default ResultItem;
