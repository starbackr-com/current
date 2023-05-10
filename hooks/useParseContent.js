import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import reactStringReplace from 'react-string-replace';
import * as Linking from 'expo-linking';
import { httpRegex, nip27Regex } from '../constants/regex';
import { nip19 } from 'nostr-tools';
import { colors } from '../styles';

export const useParseContent = (event) => {
  const navigation = useNavigation();
  const users = useSelector((state) => state.messages.users);
  let content = event.content;
  content = reactStringReplace(content, /#\[([0-9]+)]/, (m, i) => {
    const position = Number(m);
    return (
      <Text
        style={{ color: colors.primary500 }}
        onPress={() => {
          navigation.navigate('Profile', {
            screen: 'ProfileScreen',
            params: { pubkey: event.tags[position][1] },
          });
        }}
        key={m + i}
      >
        @{users[event.tags[position][1]]?.name || [event.tags[position][1]]}
      </Text>
    );
  });

  content = reactStringReplace(content, httpRegex, (m, i) => {
    return (
      <Text
        style={{ color: colors.primary500 }}
        onPress={() => {
          Linking.openURL(m);
        }}
        key={m + i}
      >
        {m}
      </Text>
    );
  });
  content = reactStringReplace(content, nip27Regex, (m, i) => {
    try {
      const [uri, mention] = m.split(':');
      const { type, data } = nip19.decode(mention);
      if (type === 'nprofile' || type === 'npub') {
        return (
          <Text
            style={{ color: colors.primary500 }}
            onPress={() => {
              navigation.navigate('Profile', {
                screen: 'ProfileScreen',
                params: { pubkey: data },
              });
            }}
            key={m + i}
          >
            @{users[data]?.name || mention.slice(0, 16) + '...'}
          </Text>
        );
      } else if (type === 'nevent' || type === 'note') {
        return (
          <Text
            style={{ color: colors.primary500 }}
            onPress={() => {
              navigation.push('CommentScreen', { eventId: data });
            }}
            key={m + i}
          >
            {m.slice(0, 32) + '...'}
          </Text>
        );
      } else {
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
      }
    } catch (e) {}
  });
  return content;
};
