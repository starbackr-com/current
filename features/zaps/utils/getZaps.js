import {
  getReadRelays,
  getRelayUrls,
  pool,
} from '../../../utils/nostrV2/relays.ts';
import { Zap } from '../Zap';

export const getZaps = async (eventIds) => {
  const readUrls = getRelayUrls(getReadRelays());
  const allZaps = {};
  const zapsPerPost = {};
  await new Promise((resolve) => {
    const sub = pool.sub(readUrls, [{ kinds: [9735], '#e': eventIds }]);
    sub.on('event', (event) => {
      const zap = new Zap(event);
      allZaps[zap.id] = zap;
    });
    sub.on('eose', () => {
      resolve();
    });
  });
  const array = Object.keys(allZaps).map((key) => allZaps[key]);
  array.forEach((zap) => {
    if (zapsPerPost[zap.toEvent]) {
      zapsPerPost[zap.toEvent].zaps.push(zap);
      zapsPerPost[zap.toEvent].amount += zap.amount;
    } else {
      zapsPerPost[zap.toEvent] = { amount: zap.amount, zaps: [zap] };
    }
  });
  return zapsPerPost;
};

export default getZaps;
