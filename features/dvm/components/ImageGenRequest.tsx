import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Event } from 'nostr-tools';
import { imageRegex } from '../../../constants';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { tags } from 'react-native-svg/lib/typescript/xml';
import { colors, globalStyles } from '../../../styles';

function getPrompt(event: Event): string {
  const promptTag = event.tags.filter((tag) => tag[0] === 'i');
  if (promptTag.length > 0) {
    return promptTag[0][1];
  }
  return undefined;
}

const ImageGenRequest = ({ event }) => {
  const nav = useNavigation();
  const prompt = getPrompt(event);
  return (
    //@ts-ignore
    <View style={{padding: 10, backgroundColor: colors.backgroundSecondary, borderRadius: 10, maxWidthidth: '90%', alignSelf: 'flex-end'}}>
      <Text style={[globalStyles.textBodyG, {textAlign: 'right'}]}>Request</Text>
      <Text style={[globalStyles.textBody, {textAlign: 'right'}]}>{prompt}</Text>
    </View>
  );
};

export default ImageGenRequest;
