import * as Notifications from 'expo-notifications';
import { Event, nip19 } from 'nostr-tools';
import { Linking } from 'react-native';

const linkingConfig = {
  prefixes: ['exp://', 'exp://192.168.3.116:19000/--/', 'nostr:'],
  config: {
    screens: {
      Profile: {
        initialRouteName: 'MainTabNav',
        screens: {
          ProfileScreen: 'profile/:pubkey',
        },
      },
      MainTabNav: {
        screens: {
          Home: {
            screens: {
              CommentScreen: 'note/:eventId',
            },
          },
          Messages: {
            initialRouteName: 'All Chats',
            screens: {
              Chat: 'message/:pk',
            },
          },
        },
      },
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();

    if (url != null) {
      if (url.startsWith('nostr:')) {
        try {
          const { type, data } = nip19.decode(url.slice(6));
          if (type === 'npub') {
            return `exp://profile/${data}`;
          }
          if (type === 'note') {
            return `nostr://note/${data}`;
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    const response = await Notifications.getLastNotificationResponseAsync();
    if (response) {
      const event = response.notification.request.content.data as Event;
      if (event.kind === 4) {
        const author = event.pubkey;
        return `nostr://message/${author}`;
      }
      if (event.kind === 1) {
        const id = event.id;
        return `nostr://note/${id}`;
      }
    }
    return null;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }) => {
      if (url.startsWith('nostr:')) {
        const { type, data } = nip19.decode(url.slice(6));
        if (type === 'npub') {
          listener(`nostr://profile/${data}`);
        }
        if (type === 'note') {
          listener(`nostr://note/${data}`);
        }
      }
    };

    const eventListenerSubscription = Linking.addEventListener(
      'url',
      onReceiveURL,
    );

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        try {
          if (response?.notification.request.content.data.kind === 4) {
            const author = response?.notification.request.content.data.pubkey;
            listener(`nostr://message/${author}`);
          }
        } catch (e) {
          console.log(e);
        }
      },
    );

    return () => {
      eventListenerSubscription.remove();
      subscription.remove();
    };
  },
};

export default linkingConfig;
