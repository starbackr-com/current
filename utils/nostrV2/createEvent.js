import { getEventHash, getPublicKey, signEvent } from 'nostr-tools';

/* eslint-disable import/prefer-default-export */
export async function createKind3(followedPubkeyArray, relayArray, sk) {
  const pk = getPublicKey(sk);
  const relayObject = {};
  relayArray.forEach((relay) => {
    relayObject[relay.url] = { read: relay.read, write: relay.write };
  });
  const tags = followedPubkeyArray.map((key) => ['p', key]);

  const event = {
    kind: 3,
    created_at: Math.floor(Date.now() / 1000),
    tags,
    content: JSON.stringify(relayObject),
    pubkey: pk,
  };

  event.id = getEventHash(event);
  event.sig = signEvent(event, sk);
  return event;
}
