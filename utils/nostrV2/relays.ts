import { SimplePool } from 'nostr-tools';
import { store } from '../../store/store';

type Relay = {
  url: string;
  read: boolean;
  write: boolean;
};

export const pool = new SimplePool();

export async function getRecommendedRelays() {
  let recommendedRelays: string[];
  try {
    const response = await fetch(`${process.env.BASEURL}/relays`);
    const data = await response.json();
    recommendedRelays = data.result;
  } catch (e) {
    recommendedRelays = [
      'wss://nostr1.current.fyi',
      'wss://relay.current.fyi',
      'wss://nos.lol',
      'wss://nostr-pub.wellorder.net',
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
