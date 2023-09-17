import { View, Text, Pressable } from 'react-native';
import React, { useMemo } from 'react';
import { Event } from 'nostr-tools';
import { imageRegex } from '../../../constants';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';

import { useNavigation } from '@react-navigation/native';
import { colors, globalStyles } from '../../../styles';
import { getTagValue } from '../../../utils/nostrV2/tags';
import { CustomButton } from '../../../components';

function parseAndReplaceImages(event: Event): [string, string[]] {
  const images: string[] = [];
  const parsedContent = event.content.replace(imageRegex, (match) => {
    images.push(match);
    return '';
  });
  return [parsedContent, images];
}

const ImageGenResult = ({ event }) => {
  const status = useMemo(() => getTagValue(event, 'status'), []);
  const navigation = useNavigation();
  const [_, images] = parseAndReplaceImages(event);
  return (
    <View
      style={{
        gap: 2,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 10,
      }}
    >
      <Pressable
        onPress={() => {
          //@ts-ignore
          navigation.navigate('ImageModal', { imageUri: images });
        }}
        style={{
          padding: 12,
          paddingBottom: 0,
        }}
      >
        <Text style={[globalStyles.textBodyG, { textAlign: 'left' }]}>
          Result
        </Text>
        {status === 'error' ? (
          <Text style={[globalStyles.textBodyError, { textAlign: 'left' }]}>
            {event.content}
          </Text>
        ) : undefined}
        {images.length > 0 ? (
          <Image
            source={images[0]}
            style={{ width: '100%', height: 300, borderRadius: 10 }}
            contentFit="cover"
          />
        ) : undefined}
      </Pressable>
      <View style={{ gap: 10, flexDirection: 'row' }}>
        <CustomButton
          text="Copy"
          icon="document"
          containerStyles={{ flex: 1 }}
          buttonConfig={{ onPress: async () => {
            await Clipboard.setStringAsync(images[0]);
          } }}
        />
        <CustomButton
          text="Share"
          icon="share"
          containerStyles={{ flex: 1 }}
          buttonConfig={{
            onPress: () => {
              //@ts-ignore
              navigation.navigate('PostView', {
                screen: 'PostNote',
                params: { image: images[0] },
              });
            },
          }}
        />
      </View>
    </View>
  );
};

export default ImageGenResult;
