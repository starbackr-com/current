import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import useBadge from '../hooks/useBadge';
import LoadingSkeleton from '../../../components/LoadingSkeleton';
import { useNavigation } from '@react-navigation/native';

const BadgeIcon = ({ badgeDefinition }) => {
  const badgeUID = badgeDefinition[1];
  const badge = useBadge(badgeUID);
  const navigation = useNavigation();
  console.log(badge);
  let src;
  if (badge) {
    [[, src]] = badge.tags.filter((tag) => tag[0] === 'thumb');
  }

  const navigationHandler = () => {
    navigation.navigate('BadgeDetails', { badgeUID });
  };
  return (
    <Pressable style={{ marginRight: 12 }} onPress={navigationHandler}>
      {src ? (
        <Image
          source={src}
          style={{ width: 40, height: 40, borderRadius: 10 }}
          contentFit="contain"
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
