import { View, Text } from 'react-native';
import React from 'react';
import BadgeIcon from './BadgeIcon';

const BadgeBar = ({ badgeDefinition }) => {
  const badges = badgeDefinition.slice(0, 5);
  return (
    <View style={{flexDirection: 'row'}}>
      {badges
        ? badges.map((badge) => <BadgeIcon badgeDefinition={badge} />)
        : undefined}
    </View>
  );
};

export default BadgeBar;
