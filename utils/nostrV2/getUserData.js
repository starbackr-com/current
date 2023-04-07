import { store } from '../../store/store';
import { Event } from './Event';
import { connectedRelays } from './relay';
import { connectedRelayPool, pool } from './relayPool';

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
    setTimeout(() => {
      resolve();
    }, 5000);
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

export const getOldKind0 = async (pubkeyInHex) => {
  return Promise.allSettled(
    connectedRelayPool.map(
      (relay) =>
        new Promise((resolve, reject) => {
          const allEvents = [];
          let sub = relay.sub([
            {
              authors: [pubkeyInHex],
              kinds: [0],
            },
          ]);
          let timer = setTimeout(() => {
            console.log(`${relay.url} timed out after 5 sec...`);
            reject();
            return;
          }, 5000);
          sub.on('event', (event) => {
            allEvents.push(event);
          });
          sub.on('eose', () => {
            console.log('eose!');
            sub.unsub();
            clearTimeout(timer);
            resolve(allEvents);
            return;
          });
        }),
    ),
  ).then((result) =>
    result
      .filter((promise) => promise.status === 'fulfilled')
      .map((promise) => promise.value),
  );
};

export const getOldKind0Pool = async (pubkeyInHex) => {
  const urls = connectedRelayPool.map((relay) => relay.url);
  const result = await new Promise((resolve) => {
    const receviedEvents = [];
    const sub = pool.sub(urls, [
      {
        authors: [pubkeyInHex],
        kinds: [3],
      },
    ]);
    sub.on('event', (event) => {
      receviedEvents.push(event);
    });
    sub.on('eose', () => {
      const [mostRecent] = receviedEvents.sort((a, b) => b.created_at - a.created_at);
      resolve(mostRecent);
    });
  });
  return result;
};

export const getKind3Followers = async (pubkeyInHex) => {
  const events = await Promise.allSettled(
    connectedRelays.map(
      (relay) =>
        new Promise((resolve, reject) => {
          const allEvents = [];
          let sub = relay.sub([
            {
              authors: [pubkeyInHex],
              kinds: [3],
            },
          ]);
          let timer = setTimeout(() => {
            console.log(`${relay.url} timed out after 5 sec...`);
            reject();
            return;
          }, 5000);
          sub.on('event', (event) => {
            allEvents.push(event);
          });
          sub.on('eose', () => {
            console.log('eose!');
            sub.unsub();
            clearTimeout(timer);
            resolve(allEvents);
            return;
          });
        }),
    ),
  ).then((result) =>
    result
      .filter((promise) => promise.status === 'fulfilled')
      .map((promise) => promise.value),
  );
  const array = [];
  try {
    events.forEach((event) =>
      event[0]?.tags.forEach((tag) => array.push(tag[1])),
    );
    const deduped = [];
    array.forEach((key) => {
      if (!deduped.includes(key)) {
        deduped.push(key);
      }
    });
    return deduped;
  } catch (e) {
    console.log(e);
  }
};
