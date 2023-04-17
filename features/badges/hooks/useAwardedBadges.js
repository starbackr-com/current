import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getReadRelays, getRelayUrls, pool } from '../../../utils/nostrV2';

const useAwardedBadges = () => {
  const [events, setEvents] = useState([]);
  const readUrls = getRelayUrls(getReadRelays());
  const pk = useSelector((state) => state.auth.pubKey);
  useEffect(() => {
    const sub = pool.sub(readUrls, [
      {
        kinds: [8],
        '#p': [pk],
      },
    ]);
    sub.on('event', (event) => {
      const [[, badgeUID]] = event.tags.filter((tag) => tag[0] === 'a');
      const awardId = event.id;
      setEvents((prev) => [...prev, { badgeUID, awardId }]);
    });
    return () => {
      sub.unsub();
    };
  }, []);
  return events;
};

export default useAwardedBadges;
