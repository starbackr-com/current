import { View, Text } from 'react-native';
import React, { memo } from 'react';
import { Event } from 'nostr-tools';
import { Image } from 'expo-image';
import { colors, globalStyles } from '../../../styles';

function getPrompt(event: Event): string {
  const promptTag = event.tags.filter(
    (tag) => tag[0] === 'i' && tag[2] === 'text',
  );
  if (promptTag.length > 0) {
    return promptTag[0][1];
  }
  return undefined;
}

function getImage(event: Event): string {
  const promptTag = event.tags.filter(
    (tag) => tag[0] === 'i' && tag[2] === 'url',
  );
  if (promptTag.length > 0) {
    return promptTag[0][1];
  }
  return undefined;
}

type ImageGenRequestProps = {
  event: Event
}

const ImageGenRequest = memo(({ event }: ImageGenRequestProps) => {
  const prompt = getPrompt(event);
  const image = getImage(event);
  return (
    //@ts-ignore
    <View
      style={{
        padding: 10,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 10,
        maxWidth: '90%',
        alignSelf: 'flex-end',
      }}
    >
      <Text style={[globalStyles.textBodyG, { textAlign: 'right' }]}>
        {image ? 'Remix Request' : 'Generation Request'}
      </Text>
      {image ? (
        <Image
          style={{ width: 200, height: 200, borderRadius: 10 }}
          source={image}
        />
      ) : undefined}
      <Text style={[globalStyles.textBody, { textAlign: 'right' }]}>
        {prompt?.trim()}
      </Text>
    </View>
  );
});

export default ImageGenRequest;
