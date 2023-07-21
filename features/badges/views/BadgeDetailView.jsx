import { View, Text, useWindowDimensions } from 'react-native';
import React, { useMemo } from 'react';
import { Image } from 'expo-image';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { nip19 } from 'nostr-tools';
import { colors, globalStyles } from '../../../styles';
import useBadge from '../hooks/useBadge';
import IssuedBy from '../components/IssuedBy';

const BadgeDetailView = ({ route }) => {
  const { badgeUID } = route.params || {};
  const badge = useBadge(badgeUID);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  let src;
  let name;
  let description;
  const rawIssuedText = useMemo(() => {
    if (badge) {
      [[, src]] = badge.tags.filter((tag) => tag[0] === 'image');
      [[, name]] = badge.tags.filter((tag) => tag[0] === 'name');
      [[, description]] = badge.tags.filter((tag) => tag[0] === 'description');
      return `Issued by nostr:${nip19.npubEncode(badge.pubkey)}`;
    }
    return undefined;
  }, [badge]);
  return (
    <ScrollView
      style={[globalStyles.screenContainerScroll]}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <Text style={[globalStyles.textH2, { textAlign: 'center' }]}>{name}</Text>
      <Image
        style={{
          width: width * 0.7,
          height: width * 0.7,
          borderRadius: 10,
          backgroundColor: colors.backgroundSecondary,
          marginBottom: 12,
        }}
        source={src}
        contentFit="cover"
      />
      <Text style={globalStyles.textBody}>{description}</Text>
      <IssuedBy rawText={rawIssuedText} />
      <View style={{ height: insets.bottom * 2 }} />
    </ScrollView>
  );
};

export default BadgeDetailView;
