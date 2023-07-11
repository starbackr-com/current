import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { Image } from 'expo-image';
import CharacterImagePlaceholder from '../../../components/CharacterImagePlaceholder';
import { colors, globalStyles } from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import Community from '../models/Community';
import { Ionicons } from '@expo/vector-icons';

type CommunityListItemProps = {
  groupSlug: string;
  groupPicture?: string;
  communityObject: Community;
};

const CommunityListItem = ({
  groupPicture,
  groupSlug,
  communityObject,
}: CommunityListItemProps) => {
  const { navigate } = useNavigation();
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        // @ts-ignore
        navigate('Community Chat', { communityObject });
      }}
    >
      {communityObject.communityPicture ? (
        <Image source={communityObject.communityPicture} style={styles.image}/>
      ) : (
        <CharacterImagePlaceholder
          name={communityObject.communitySlug.slice(1)}
        />
      )}
      <View>
        <Text style={globalStyles.textBodyBold}>{groupSlug}</Text>
      </View>
      <View></View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    borderBottomColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25
  }
});

export default CommunityListItem;
