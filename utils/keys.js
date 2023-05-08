/* eslint-disable import/no-extraneous-dependencies */
import { nip06 } from 'nostr-tools';
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

export const generateSeedphrase = () => {
  const mem = generateMnemonic(wordlist, 128).split(' ');
  return mem;
};

export const mnemonicToSeed = (words) => {
  const privKey = nip06.privateKeyFromSeedWords(words.join(' '));
  return privKey;
};
