import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { pool } from '../../../utils/nostrV2';
import Community from '../models/Community';

const useCommunities = () => {
  const communities = useSelector((state) => state.community.communities);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const sub = pool.sub(
      ['wss://spool.chat'],
      [{ kinds: [39000], since: 1687395734 }],
      { skipVerification: true },
    );
    sub.on('event', (event) => {
      const [relay] = pool.seenOn(event.id);
      const parsedCommunity = new Community(event, relay);
      parsedCommunity.save();
    });
    return () => {
      sub.unsub();
    };
  }, [refresh]);
  return [communities, setRefresh];
};

export default useCommunities;
