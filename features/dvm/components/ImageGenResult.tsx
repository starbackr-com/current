import { View, Text, Pressable } from 'react-native';
import React, { memo, useMemo } from 'react';
import { Event } from 'nostr-tools';
import { imageRegex } from '../../../constants';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';

import { useNavigation } from '@react-navigation/native';
import { colors, globalStyles } from '../../../styles';
import { getTagValue } from '../../../utils/nostrV2/tags';
import { CustomButton } from '../../../components';
import { useDispatch } from 'react-redux';
import { appendToText } from '../../post/composeSlice';
import { downloadFileAndGetUri } from '../../../utils/files';

function parseAndReplaceImages(event: Event): [string, string[]] {
  const images: string[] = [];
  const parsedContent = event.content.replace(imageRegex, (match) => {
    images.push(match);
    return '';
  });
  return [parsedContent, images];
}

type ImageGenResultProps = {
  event: Event;
};

const ImageGenResult = memo(({ event }: ImageGenResultProps) => {
  const status = useMemo(() => getTagValue(event, 'status'), []);
  const navigation = useNavigation();
  const [_, images] = parseAndReplaceImages(event);
  const dispatch = useDispatch();

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
      {status != 'error' ? (
        <View style={{ gap: 10, flexDirection: 'row' }}>
          <CustomButton
            text="Copy"
            icon="document"
            containerStyles={{ flex: 1 }}
            buttonConfig={{
              onPress: async () => {
                await Clipboard.setStringAsync(images[0]);
              },
            }}
          />
          <CustomButton
            text="Post"
            icon="pencil"
            containerStyles={{ flex: 1 }}
            buttonConfig={{
              onPress: () => {
                dispatch(appendToText(images[0]));
                //@ts-ignore
                navigation.navigate('PostView', {
                  screen: 'PostNote',
                  params: { image: images[0] },
                });
              },
            }}
          />
          <CustomButton
            text="Share"
            icon="share"
            containerStyles={{ flex: 1 }}
            buttonConfig={{
              onPress: async () => {
                try {
                  const uri = await downloadFileAndGetUri(images[0]);
                  Sharing.shareAsync(uri);
                } catch (e) {
                  console.log(e);
                }
              },
            }}
          />
        </View>
      ) : undefined}
    </View>
  );
});

export default ImageGenResult;
