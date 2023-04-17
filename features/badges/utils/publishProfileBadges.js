import { getEventHash, signEvent } from 'nostr-tools';
import { getRelayUrls, getWriteRelays, pool } from '../../../utils/nostrV2';
import { getValue } from '../../../utils';
import devLog from '../../../utils/internal';

async function publishProfileBadges(profileBadgeArray, pk) {
  try {
    const sk = await getValue('privKey');
    if (!sk) {
      throw new Error('No privKey in secure storage found');
    }
    const event = {
      kind: 30008,
      pubkey: pk,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['d', 'profile_badges']],
      content: '',
    };
    profileBadgeArray.forEach((badge) => {
      event.tags.push(['a', badge.badgeUID]);
      event.tags.push(['e', badge.awardId]);
    });
    event.id = getEventHash(event);
    event.sig = signEvent(event, sk);
    const writeUrls = getRelayUrls(getWriteRelays());
    await new Promise((resolve) => {
      let handled = 0;
      const timer = setTimeout(resolve, 3200);
      function checkIfHandled() {
        if (handled === writeUrls.length) {
          clearTimeout(timer);
          resolve();
        }
      }
      const pubs = pool.publish(writeUrls, event);
      pubs.on('ok', () => {
        handled += 1;
        checkIfHandled();
      });
      pubs.on('failed', () => {
        handled += 1;
        checkIfHandled();
      });
    });
  } catch (e) {
    devLog(e);
  }
}

export default publishProfileBadges;

// {
//   "kind": 30008,
//   "pubkey": "bob",
//   "tags": [
//     ["d", "profile_badges"],
//     ["a", "30009:alice:bravery"],
//     ["e", "<bravery badge award event id>", "wss://nostr.academy"],
//     ["a", "30009:alice:honor"],
//     ["e", "<honor badge award event id>", "wss://nostr.academy"],
//   ],
//   ...
// }
