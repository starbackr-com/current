import { View, Pressable } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import useBadge from '../hooks/useBadge';
import LoadingSkeleton from '../../../components/LoadingSkeleton';

const BadgeIcon = ({ badgeDefinition }) => {
  const badgeUID = badgeDefinition[1];
  const badge = useBadge(badgeUID);
  const navigation = useNavigation();
  let src;
  if (badge) {
    [[, src]] = badge.tags.filter((tag) => tag[0] === 'thumb');
  }

  const navigationHandler = () => {
    navigation.navigate('BadgeDetails', { badgeUID });
  };
  return (
    <Pressable style={{ marginHorizontal: 6}} onPress={navigationHandler}>
      {src ? (
        <Image
          source={src}
          style={{ width: 40, height: 40, borderRadius: 10 }}
          contentFit="cover"
          priority="low"
        />
      ) : (
        <View style={{ width: 40, height: 40, borderRadius: 10 }}>
          <LoadingSkeleton />
        </View>
      )}
    </Pressable>
  );
};

export default BadgeIcon;
