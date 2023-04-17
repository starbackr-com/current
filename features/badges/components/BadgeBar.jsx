import { View } from 'react-native';
import React from 'react';
import BadgeIcon from './BadgeIcon';

const BadgeBar = ({ badgeDefinition }) => {
  const badges = badgeDefinition.slice(0, 5);
  return (
    <View
      style={{ flexDirection: 'row', width: '100%' }}
    >
      {badges
        ? badges.map((badge) => <BadgeIcon badgeDefinition={badge} key={badge} />)
        : undefined}
    </View>
  );
};

export default BadgeBar;
