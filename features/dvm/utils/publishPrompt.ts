import {
  getEventHash,
  getPublicKey,
  nip04,
  nip19,
  signEvent,
} from 'nostr-tools';
import { getRelayUrls, getWriteRelays, publishGenericEvent } from '../../../utils/nostrV2';
import { getValue } from '../../../utils';
import { mentionRegex } from '../../../constants';

async function publishPrompt(receiverPk, content) {
  const writeUrls = getRelayUrls(getWriteRelays());
  const parsedContent = content.replaceAll(
    mentionRegex,
    (m, g1, g2) => `nostr:${nip19.npubEncode(g2)}`,
  );
  const sk = await getValue('privKey');
  const pk = getPublicKey(sk);
  const encryptedMessage = await nip04.encrypt(sk, receiverPk, parsedContent);
  const event = {
    pubkey: pk,
    kind: 4,
    created_at: Math.floor(Date.now() / 1000),
    tags: [['p', receiverPk]],
    content: encryptedMessage,
    id: '',
    sig: '',
  };
  event.id = getEventHash(event);
  event.sig = signEvent(event, sk);
  await publishGenericEvent(event, writeUrls);
}

export default publishPrompt;
