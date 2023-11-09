import * as Notifications from 'expo-notifications';
import { Event, nip19 } from 'nostr-tools';
import { Linking } from 'react-native';
import { store } from '../store/store';
import { replaceText } from '../features/post/composeSlice';

function returnHexFromEntity(entity) {
  try {
    const { type, data } = nip19.decode(entity);
    switch (type) {
      case 'npub':
        console.log(data);
        return data;
      case 'nprofile':
        //@ts-ignore
        return data.pubkey;
      case 'note':
        console.log(data);
        return data;
      case 'nevent':
        //@ts-ignore
        return data.id;
    }
  } catch (e) {
    console.log(e);
    return entity;
  }
}

const linkingConfig = {
  prefixes: [
    'exp://',
    'exp://192.168.3.116:19000/--/',
    'nostr:',
    'https://getcurrent.io',
  ],
  config: {
    screens: {
      Profile: {
        initialRouteName: 'MainTabNav',
        screens: {
          ProfileScreen: {
            path: '/link/p/:pubkey',
            parse: {
              pubkey: (entity) => returnHexFromEntity(entity),
            },
          },
        },
      },
      PostView: {
        initialRouteName: 'MainTabNav',
        screens: {
          PostNote: {
            path: '/intent?text',
          },
        },
      },
      MainTabNav: {
        screens: {
          Home: {
            initialRouteName: 'HomeScreen',
            screens: {
              CommentScreen: {
                path: '/link/e/:eventId',
                parse: {
                  eventId: (entity) => returnHexFromEntity(entity),
                },
              },
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
      if (url.startsWith('https://getcurrent.io')) {
        const { pathname, searchParams } = new URL(url);
        if (pathname.startsWith('/intent')) {
          const text = searchParams.get('text');
          if (text) {
            store.dispatch(replaceText(text));
          }
        }
        return url;
      }
      if (url.startsWith('nostr:')) {
        const entity = url.slice(6);
        try {
          const { type } = nip19.decode(entity);
          if (type === 'npub') {
            return `/link/p/${entity}`;
          }
          if (type === 'note') {
            return `/link/e/${entity}`;
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
        return `/link/e/${id}`;
      }
    }
    return null;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }) => {
      if (url.startsWith('https://getcurrent.io')) {
        const { pathname, searchParams } = new URL(url);
        if (pathname.startsWith('/intent')) {
          const text = searchParams.get('text');
          if (text) {
            store.dispatch(replaceText(text));
          }
        }
        listener(url);
      }
      if (url.startsWith('nostr:')) {
        const data = url.slice(6);
        if (data.startsWith('npub')) {
          listener(`/link/p/${data}`);
        }
        if (data.startsWith('nprofile')) {
          listener(`/link/p/${data}`);
        }
        if (data.startsWith('nprofile')) {
          listener(`/link/e/${data}`);
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
