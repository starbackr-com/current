import { View, Text, useWindowDimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { colors, globalStyles } from '../../../styles';
import useBadge from '../hooks/useBadge';
import LoadingSkeleton from '../../../components/LoadingSkeleton';

const BadgeDetailView = ({ route }) => {
  const { badgeUID } = route.params || {};
  const badge = useBadge(badgeUID);
  const { width } = useWindowDimensions();
  let src;
  let name;
  let description;
  if (badge) {
    [[, src]] = badge.tags.filter((tag) => tag[0] === 'image');
    [[, name]] = badge.tags.filter((tag) => tag[0] === 'name');
    [[, description]] = badge.tags.filter((tag) => tag[0] === 'description');
  }
  return (
    <View style={globalStyles.screenContainer}>
      <View>
        <Text style={globalStyles.textBodyBold}>{name}</Text>
        <Text style={globalStyles.textBody}>{description}</Text>
      </View>
      <View>
        <Image
          style={{
            width: width * 0.7,
            height: width * 0.7,
            borderRadius: 10,
            backgroundColor: colors.backgroundSecondary
          }}
          source={src}
          contentFit="cover"
        />
      </View>
    </View>
  );
};

export default BadgeDetailView;
