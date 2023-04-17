import { useEffect, useState } from 'react';
import { getReadRelays, getRelayUrls, pool } from '../../../utils/nostrV2';

const useAwardedBadges = (pubkeyInHex) => {
  const [events, setEvents] = useState([]);
  const readUrls = getRelayUrls(getReadRelays());
  useEffect(() => {
    const sub = pool.sub(readUrls, [
      {
        kinds: [8],
        '#p': [
          '1577e4599dd10c863498fe3c20bd82aafaf829a595ce83c5cf8ac3463531b09b',
        ],
      },
    ]);
    sub.on('event', (event) => {
      const [[, badgeUID]] = event.tags.filter((tag) => tag[0] === 'a');
      setEvents((prev) => [...prev, badgeUID]);
    });
    return () => {
      sub.unsub();
    };
  }, []);
  return events;
};

export default useAwardedBadges;
