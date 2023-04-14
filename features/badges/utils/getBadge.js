import { getReadRelays, getRelayUrls, pool } from '../../../utils/nostrV2';

async function getBadge(badgeEventId) {
  const readUrls = getRelayUrls(getReadRelays());
  const badgeEvent = await pool.get(readUrls, { ids: [badgeEventId] });
  return badgeEvent;
}

e

export default getBadge;
