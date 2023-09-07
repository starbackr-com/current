import { getEventHash, getPublicKey, signEvent } from 'nostr-tools';
import { getPrivateKey } from '../../../utils/cache/asyncStorage';
import { publishGenericEvent } from '../../../utils/nostrV2';

const publishImageJob = async (prompt) => {
  const sk = await getPrivateKey();
  const event = {
    content: '',
    kind: 65005,
    tags: [
      ['i', prompt, 'text'],
      ['output', 'image/png'],
      ['param', 'size', '512x768'],
      [
        'relays',
        'wss://nostrue.com',
        'wss://relayable.org',
        'wss://nos.lol',
        'wss://relay.conxole.io',
        'wss://wc1.current.ninja',
        'wss://pablof7z.nostr1.com',
        'wss://relay.f7z.io'
      ],
      ['p', 'c70735fa4b01f77f953883a6e671982e31bd7d906b2b6111a6f518555bed1b1a']
    ],
    created_at: Math.floor(Date.now() / 1000),
    pubkey: getPublicKey(sk),
    id: '',
    sig: '',
  };
  event.id = getEventHash(event);
  event.sig = signEvent(event, sk);
  publishGenericEvent(event, [
    'wss://nostrue.com',
    'wss://relayable.org',
    'wss://nos.lol',
    'wss://relay.conxole.io',
    'wss://wc1.current.ninja',
    'wss://pablof7z.nostr1.com',
    'wss://relay.f7z.io'
  ]);
};

export default publishImageJob;