import { getReadRelays, getRelayUrls, pool } from '../../../utils/nostrV2';

async function getBadge(badgeUID) {
  const [, author, identifier] = badgeUID.split(':');
  const readUrls = getRelayUrls(getReadRelays());
  const badgeEvent = await new Promise((resolve) => {
    const sub = pool.sub(readUrls, [
      { authors: [author], '#d': [identifier], kinds: [30009] },
    ]);
    sub.on('event', (event) => {
      resolve(event);
    });
  });
  return badgeEvent;
}

export default getBadge;
