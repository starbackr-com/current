/* eslint-disable import/no-extraneous-dependencies */
import { getEventHash, getPublicKey, nip06, signEvent } from 'nostr-tools';
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { getValue } from './secureStore';

export const generateSeedphrase = () => {
  const mem = generateMnemonic(wordlist, 128).split(' ');
  return mem;
};

export const mnemonicToSeed = (words) => {
  const privKey = nip06.privateKeyFromSeedWords(words.join(' '));
  return privKey;
};

export async function signRawEvent(event) {
  const rawEvent = event;
  const sk = await getValue('privKey');
  const pk = getPublicKey(sk);
  rawEvent.pubkey = pk;
  rawEvent.id = getEventHash(rawEvent);
  rawEvent.sig = signEvent(rawEvent, sk);

  return rawEvent;
}
