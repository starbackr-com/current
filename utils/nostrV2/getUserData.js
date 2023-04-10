import { SimplePool } from 'nostr-tools';
import { store } from '../../store/store';
import { Event } from './Event';

const pool = new SimplePool();

export const updateFollowedUsers = async () => {
  const pubkeys = store.getState().user.followedPubkeys;
  const urls = connectedRelayPool.map((relay) => relay.url);
  await new Promise((resolve) => {
    const sub = pool.sub(
      urls,
      [
        {
          authors: pubkeys,
          kinds: [0],
        },
      ],
      { skipVerification: true },
    );
    sub.on('event', (event) => {
      const newEvent = new Event(event);
      newEvent.save();
    });
    sub.on('eose', () => {
      sub.unsub();
      resolve();
    });
  });
};

export const getUserData = async (pubkeysInHex) => {
  const urls = connectedRelayPool.map((relay) => relay.url);
  const sub = pool.sub(urls, [
    {
      authors: pubkeysInHex,
      kinds: [0],
    },
  ]);
  sub.on('event', (event) => {
    const newEvent = new Event(event);
    newEvent.save();
  });
  sub.on('eose', () => {
    sub.unsub();
  });
};

export const getOldKind0 = async (pubkeyInHex) =>
  Promise.allSettled(
    connectedRelayPool.map(
      (relay) =>
        new Promise((resolve, reject) => {
          const allEvents = [];
          const sub = relay.sub([
            {
              authors: [pubkeyInHex],
              kinds: [0],
            },
          ]);
          const timer = setTimeout(() => {
            console.log(`${relay.url} timed out after 5 sec...`);
            reject();
          }, 5000);
          sub.on('event', (event) => {
            allEvents.push(event);
          });
          sub.on('eose', () => {
            console.log('eose!');
            sub.unsub();
            clearTimeout(timer);
            resolve(allEvents);
          });
        }),
    ),
  ).then((result) =>
    result
      .filter((promise) => promise.status === 'fulfilled')
      .map((promise) => promise.value),
  );

export const getOldKind0Pool = async (pubkeyInHex) => {
  const { relays } = store.getState().relays;
  const readRelays = Object.keys(relays).filter((relay) => relays[relay].read);
  const result = await new Promise((resolve) => {
    const receviedEvents = [];
    const sub = pool.sub(readRelays, [
      {
        authors: [pubkeyInHex],
        kinds: [3],
      },
    ]);
    sub.on('event', (event) => {
      receviedEvents.push(event);
    });
    sub.on('eose', () => {
      const [mostRecent] = receviedEvents.sort(
        (a, b) => b.created_at - a.created_at,
      );
      resolve(mostRecent);
    });
  });
  return result;
};

// export const getKind3Followers = async (pubkeyInHex) => {
//   const events = await Promise.allSettled(
//     connectedRelays.map(
//       (relay) =>
//         new Promise((resolve, reject) => {
//           const allEvents = [];
//           const sub = relay.sub([
//             {
//               authors: [pubkeyInHex],
//               kinds: [3],
//             },
//           ]);
//           const timer = setTimeout(() => {
//             console.log(`${relay.url} timed out after 5 sec...`);
//             reject();
//           }, 5000);
//           sub.on('event', (event) => {
//             allEvents.push(event);
//           });
//           sub.on('eose', () => {
//             sub.unsub();
//             clearTimeout(timer);
//             resolve(allEvents);
//           });
//         }),
//     ),
//   ).then((result) =>
//     result
//       .filter((promise) => promise.status === 'fulfilled')
//       .map((promise) => promise.value),
//   );
//   const array = [];
//   try {
//     events.forEach((event) =>
//       event[0]?.tags.forEach((tag) => array.push(tag[1])),
//     );
//     const deduped = [];
//     array.forEach((key) => {
//       if (!deduped.includes(key)) {
//         deduped.push(key);
//       }
//     });
//     return deduped;
//   } catch (e) {
//     console.log(e);
//   }
// };

export async function getContactAndRelayList(pubkeyInHex) {
  const urls = [
    'wss://nostr1.current.fyi',
    'wss://relay.current.fyi',
    'wss://nos.lol',
    'wss://nostr-pub.wellorder.net',
  ];
  const mostRecentEvent = await new Promise((resolve, reject) => {
    const receivedEvents = [];
    const sub = pool.sub(urls, [
      {
        authors: [pubkeyInHex],
        kinds: [3],
      },
    ]);
    sub.on('event', (event) => {
      receivedEvents.push(event);
    });

    sub.on('eose', () => {
      if (receivedEvents.length > 0) {
        receivedEvents.sort((a, b) => b.created_at - a.created_at);
        const [mostRecent] = receivedEvents;
        resolve(mostRecent);
      }
      reject(Error('No Contact List received...'));
    });
  });
  return mostRecentEvent;
}
