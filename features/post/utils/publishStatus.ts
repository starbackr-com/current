import { getEventHash, getPublicKey, signEvent } from 'nostr-tools';
import { getValue } from '../../../utils';
import devLog from '../../../utils/internal';
import { getRelayUrls, getWriteRelays, pool } from '../../../utils/nostrV2';
import { tags } from 'react-native-svg/lib/typescript/xml';

export const publishStatus = async (
  content: string,
  website: string,
  expiresIn: number,
) => {
  try {
    const privKey = await getValue('privKey');
    if (!privKey) {
      throw new Error('No privKey in secure storage found');
    }
    const now = Math.floor(Date.now() / 1000);
    const pubKey = getPublicKey(privKey);
    const event = {
      kind: 30315,
      pubkey: pubKey,
      created_at: now,
      tags: [['d', 'general']],
      content,
      id: '',
      sig: '',
    };
    if (expiresIn) {
      event.tags.push(['expiration', String(now + expiresIn)])
    }
    if (website) {
      event.tags.push(['r', website]);
    }

    event.id = getEventHash(event);
    event.sig = signEvent(event, privKey);
    const writeUrls = getRelayUrls(getWriteRelays());
    const pub = pool.publish(writeUrls, event);
    await new Promise<void>((resolve) => {
      let handledRelays = 0;
      const timer = setTimeout(resolve, 2500);
      const checkAllHandled = () => {
        if (handledRelays === writeUrls.length) {
          clearTimeout(timer);
          resolve();
        }
      };
      pub.on('ok', () => {
        handledRelays += 1;
        checkAllHandled();
      });
      pub.on('failed', () => {
        handledRelays += 1;
        checkAllHandled();
      });
    });
    return { event };
  } catch (err) {
    devLog(err);
  }
};
