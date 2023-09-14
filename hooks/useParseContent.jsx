/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { nip19 } from 'nostr-tools';
import reactStringReplace from 'react-string-replace';
import * as Linking from 'expo-linking';
import { httpRegex, nip27Regex } from '../constants/regex';
import { colors } from '../styles';

export const useParseContent = (event) => {
  const [parsedContent, setParsedContent] = useState(event.content);
  const navigation = useNavigation();
  const users = useSelector((state) => state.messages.users);

  useEffect(() => {
    let pTags;
    let parsedTags;
    let { content } = event;
    try {
      parsedTags = event.tags.map((tag) => JSON.parse(tag));
    } catch (e) {
      parsedTags = event.tags;
      // console.log(parsedTags);
    }
    content = reactStringReplace(content, /#\[([0-9]+)]/, (m, i) => {
      try {
        if (parsedTags && parsedTags.length > 0) {
          pTags = parsedTags.filter((tag) => tag[0] === 'p');
        }
        const position = Number(m);
        return (
          <Text
            style={{ color: colors.primary500 }}
            onPress={() => {
              navigation.push('Profile', {
                screen: 'ProfileScreen',
                params: { pubkey: parsedTags[position][1] },
              });
            }}
            key={m + i}
          >
            @
            {users[pTags[position][1]]?.name ||
              `${nip19.npubEncode(pTags[position][1]).slice(0, 16)}...`}
          </Text>
        );
      } catch (e) {
        console.log(e);
        return <Text>PARSING ERROR</Text>;
      }
    });
    content = reactStringReplace(content, httpRegex, (m, i) => (
      <Text
        style={{ color: colors.primary500 }}
        onPress={() => {
          Linking.openURL(m);
        }}
        key={m + i}
      >
        {m}
      </Text>
    ));
    content = reactStringReplace(content, nip27Regex, (m, i) => {
      try {
        const [, mention] = m.split(':');
        const { type, data } = nip19.decode(mention);
        if (type === 'nprofile' || type === 'npub') {
          return (
            <Text
              style={{ color: colors.primary500 }}
              onPress={() => {
                navigation.push('Profile', {
                  screen: 'ProfileScreen',
                  params: { pubkey: data },
                });
              }}
              key={m + i}
            >
              @{users[data]?.name || `${mention.slice(0, 16)}...`}
            </Text>
          );
        }
        if (type === 'note') {
          return (
            <Text
              style={{ color: colors.primary500 }}
              onPress={() => {
                navigation.push('CommentScreen', { eventId: data });
              }}
              key={m + i}
            >
              {`${m.slice(0, 32)}...`}
            </Text>
          );
        }
        if (type === 'nevent') {
          return (
            <Text
              style={{ color: colors.primary500 }}
              onPress={() => {
                navigation.push('CommentScreen', { eventId: data.id });
              }}
              key={m + i}
            >
              {`${m.slice(0, 32)}...`}
            </Text>
          );
        }
        return (
          <Text
            style={{ color: colors.primary500 }}
            onPress={() => {
              Linking.openURL(data);
            }}
            key={m + i}
          >
            {m}
          </Text>
        );
      } catch (e) {
        console.log('Error while parsing content');
        return <Text>ERROR</Text>;
      }
    });
    setParsedContent(content);
  }, [event, users]);
  return parsedContent;
};

export default useParseContent;
