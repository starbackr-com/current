import {
  getEventHash,
  getPublicKey,
  nip04,
  nip19,
  signEvent,
} from 'nostr-tools';
import { publishGenericEvent } from '../../../utils/nostrV2';
import { getValue } from '../../../utils';
import { mentionRegex } from '../../../constants';

async function publishMessage(receiverPk, content) {
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
  };
  event.id = getEventHash(event);
  event.sig = signEvent(event, sk);
  await publishGenericEvent(event);
}

export default publishMessage;
