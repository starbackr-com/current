import { getReadRelays, getRelayUrls, pool } from '../../../utils/nostrV2';

async function getBadge(badgeUID) {
  try {
    const [, author, identifier] = badgeUID.split(':');
    const readUrls = getRelayUrls(getReadRelays());
    const badgeEvent = await new Promise((resolve) => {
      const sub = pool.sub(readUrls, [
        { authors: [author], '#d': [identifier], kinds: [30009] },
      ]);
      sub.on('event', (event) => {
        sub.unsub();
        resolve(event);
      });
    });
    return badgeEvent;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export default getBadge;
