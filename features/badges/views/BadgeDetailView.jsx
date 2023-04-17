import { View, Text, useWindowDimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { ScrollView } from 'react-native-gesture-handler';
import { nip19 } from 'nostr-tools';
import { colors, globalStyles } from '../../../styles';
import useBadge from '../hooks/useBadge';
import { useParseContent } from '../../../hooks';

const IssuedBy = ({ rawText }) => {
  const content = useParseContent({ content: rawText });
  return (
    <View>
      <Text style={globalStyles.textBody}>{content}</Text>
    </View>
  );
};

const BadgeDetailView = ({ route }) => {
  const { badgeUID } = route.params || {};
  const badge = useBadge(badgeUID);
  const { width } = useWindowDimensions();
  let src;
  let name;
  let description;
  let rawIssuedText;
  if (badge) {
    [[, src]] = badge.tags.filter((tag) => tag[0] === 'image');
    [[, name]] = badge.tags.filter((tag) => tag[0] === 'name');
    [[, description]] = badge.tags.filter((tag) => tag[0] === 'description');
    rawIssuedText = `Issued by nostr:${nip19.npubEncode(badge.pubkey)}`;
  }
  return (
    <ScrollView
      style={globalStyles.screenContainerScroll}
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
    </ScrollView>
  );
};

export default BadgeDetailView;
