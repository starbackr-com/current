import { View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BadgeIcon from './BadgeIcon';
import { colors } from '../../../styles';

const BadgeBar = ({ badgeDefinition, edit }) => {
  const badges = badgeDefinition.slice(0, 5);
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        paddingVertical: 6,
        borderRadius: 10,
      }}
    >
      {badges
        ? badges.map((badge) => (
          <BadgeIcon badgeDefinition={badge} key={badge} />
        ))
        : undefined}
      {edit ? (
        <Ionicons
          name="pencil"
          size={30}
          color={colors.primary500}
          style={{ marginHorizontal: 6 }}
          onPress={() => {
            navigation.navigate('ChooseBadge');
          }}
        />
      ) : undefined}
    </View>
  );
};

export default BadgeBar;
