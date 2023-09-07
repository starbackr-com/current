import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Event } from 'nostr-tools';
import { imageRegex } from '../../../constants';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

function parseAndReplaceImages(event: Event): [string, string[]] {
  const images: string[] = [];
  const parsedContent = event.content.replace(imageRegex, (match) => {
    images.push(match);
    return '';
  });
  return [parsedContent, images];
}

const ImageGenResult = ({ event }) => {
  const nav = useNavigation();
  const [_, images] = parseAndReplaceImages(event);
  return (
    //@ts-ignore
    <Pressable onPress={() => {nav.navigate("ImageModal", { imageUri: images })}}>
      {images.length > 0 ? (
        <Image
          source={images[0]}
          style={{ width: '100%', height: 300 }}
          contentFit="cover"
        />
      ) : undefined}
    </Pressable>
  );
};

export default ImageGenResult;
