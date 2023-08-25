import { getEventHash, getPublicKey, nip19, signEvent } from 'nostr-tools';
import { getValue } from '../../../utils/secureStore';
import devLog from '../../../utils/internal';
import {
  getRelayUrls,
  getWriteRelays,
  pool,
} from '../../../utils/nostrV2/relays';
import { mentionRegex } from '../../../constants';

export const publishReply = async (content, event) => {
  const writeUrls = getRelayUrls(getWriteRelays());
  const fullMentions = [...content.matchAll(mentionRegex)];
  const mentions = fullMentions.map((mention) => ['p', mention[2]]);
  const parsedContent = content.replaceAll(
    mentionRegex,
    (m, g1, g2) => `nostr:${nip19.npubEncode(g2)}`,
  );
  let replyETags;
  let replyPTags;
  try {
    const oldETags = event.tags.filter((tag) => tag[0] === 'e');
    const oldPTags = event.tags.filter((tag) => tag[0] === 'p');
    if (oldETags.length > 0) {
      const rootTag = oldETags.filter((tag) => tag.includes('root'));
      if (rootTag[0]) {
        replyETags = [rootTag[0], ['e', event.id, '', 'reply']];
      } else {
        replyETags = [['e', oldETags[0][1], '', 'root'], ['e', event.id, '', 'reply']];
      }
    } else {
      replyETags = [['e', event.id, 'reply']];
    }

    if (oldPTags.length > 0) {
      replyPTags = [...oldPTags, ['p', event.pubkey]];
    } else {
      replyPTags = [['p', event.pubkey]];
    }

    const sk = await getValue('privKey');
    const pk = getPublicKey(sk);

    const reply = {
      kind: 1,
      pubkey: pk,
      created_at: Math.floor(Date.now() / 1000),
      tags: [...replyETags, ...replyPTags, ...mentions],
      content: parsedContent,
    };
    console.log(reply);
    reply.id = getEventHash(reply);
    reply.sig = signEvent(reply, sk);
    const success = await new Promise((resolve, reject) => {
      const pubs = pool.publish(writeUrls, reply);
      const timer = setTimeout(() => {
        resolve(true);
      }, 2500);
      pubs.on('ok', () => {
        console.log('ok');
        clearTimeout(timer);
        resolve(true);
      });
      pubs.on('failed', () => {
        reject();
      });
    });
    return success;
  } catch (e) {
    devLog(e);
    return null;
  }
};

export default publishReply;
