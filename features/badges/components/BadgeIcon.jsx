import { View, Text } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import useBadge from '../hooks/useBadge';

const BadgeIcon = ({ badgeDefinition }) => {
  const badgeUID = badgeDefinition[1];
  const badge = useBadge(badgeUID);
  let thumb;
  if (badge) {
    thumb = badge.tags.filter((tag) => tag[0] === 'thumb')[0][1];
  }
  return (
    <View>
      {badge ? (
        <Image source={thumb} style={{ width: 50, height: 50 }} />
      ) : undefined}
    </View>
  );
};

export default BadgeIcon;
