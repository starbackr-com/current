import { SimplePool } from 'nostr-tools';
import { store } from '../../store/store';
import { getData } from '../cache/asyncStorage';
import { addRelay } from '../../features/relays/relaysSlice';

type Relay = {
  url: string;
  read: boolean;
  write: boolean;
  dm?: boolean;
};

export const pool = new SimplePool();

export async function getRecommendedRelays() {
  let recommendedRelays: Relay[];
  try {
    const response = await fetch(`${process.env.BASEURL}/relays`);
    const data = await response.json();
    recommendedRelays = data.result;
  } catch (e) {
    recommendedRelays = [
      { url: 'wss://nostr1.current.fyi', read: true, write: true, dm: true },
      { url: 'wss://relay.current.fyi', read: true, write: true, dm: true },
      { url: 'wss://nos.lol', read: true, write: true, dm: true },
      {
        url: 'wss://nostr-pub.wellorder.net',
        read: true,
        write: true,
        dm: true,
      },
    ];
  }
  return recommendedRelays;
}

export function getAllRelays(): Relay[] {
  const { relays } = store.getState().relays;
  return relays;
}

export function getReadRelays(): Relay[] {
  const relays = getAllRelays();
  const readRelays = relays.filter((relay) => relay.read);
  return readRelays;
}

export function getWriteRelays(): Relay[] {
  const relays = getAllRelays();
  const writeRelays = relays.filter((relay) => relay.write);
  return writeRelays;
}

export function getRelayUrls(relays: Relay[]): string[] {
  return relays.map((relay) => relay.url);
}

export function getRelayObject() {
  const relays = getAllRelays();
  const relayObject = {};
  relays.forEach(
    (relay) =>
      (relayObject[relay.url] = { read: relay.read, write: relay.write }),
  );
  return relayObject;
}

export async function initRelays() {
  try {
    const relaysFromStorage = JSON.parse(await getData('relays'));
    if (relaysFromStorage) {
      store.dispatch(addRelay(relaysFromStorage));
    } else {
      const relaysFromEndpoint = await getRecommendedRelays();
      store.dispatch(addRelay(relaysFromEndpoint));
    }
  } catch(e) {
    console.log(e)
  }
}
