import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { getValue } from "../../../utils";
import devLog from "../../../utils/internal";
import { getRelayUrls, getWriteRelays, pool } from "../../../utils/nostrV2";

export const publishNote = async (content, tags) => {
  try {
    const privKey = await getValue('privKey');
    if (!privKey) {
      throw new Error('No privKey in secure storage found');
    }
    const pubKey = getPublicKey(privKey);
    const event = {
      kind: 1,
      pubkey: pubKey,
      created_at: Math.floor(Date.now() / 1000),
      tags: tags || [],
      content,
      id: "",
      sig: ""
    };

    try {
      const hashtags = event.content
        .split(' ')
        .filter((v) => v.startsWith('#'));
      hashtags.forEach((tag) => {
        event.tags.push(['t', tag.replace(/^#/, '')]);
      });
    } catch (e) {
      console.log('error in setting up hashtags', e);
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
          devLog('All handled!');
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
