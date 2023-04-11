import { store } from '../../store/store';
import { Event } from './Event';
import { getReadRelays, getRelayUrls, pool } from './relays.ts';

export const updateFollowedUsers = async () => {
  const pubkeys = store.getState().user.followedPubkeys;
  const readRelayUrls = getReadRelays().map((relay) => relay.url);
  await new Promise((resolve) => {
    const sub = pool.sub(
      readRelayUrls,
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
  const readUrls = getRelayUrls(getReadRelays());
  const sub = pool.sub(readUrls, [
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

export const getOldKind0Pool = async (pubkeyInHex) => {
  const readUrls = getRelayUrls(getReadRelays());
  const result = await new Promise((resolve) => {
    const receviedEvents = [];
    const sub = pool.sub(readUrls, [
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
