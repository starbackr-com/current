import { useEffect, useState } from 'react';
import { pool } from '../../../utils/nostrV2';
// import { useRelayUrls } from '../../relays';
import { useSelector } from 'react-redux';

const useImageJob = () => {
  // const { readUrls } = useRelayUrls();
  //@ts-ignore
  const { pubKey } = useSelector((state) => state.auth);

  const [events, setEvents] = useState([]);
  useEffect(() => {
    const allEvents = new Set();
    const sub = pool.sub(
      [
        'wss://nostrue.com',
        'wss://relayable.org',
        'wss://nos.lol',
        'wss://relay.conxole.io',
        'wss://wc1.current.ninja',
        'wss://pablof7z.nostr1.com',
        'wss://relay.f7z.io',
      ],
      [
        { kinds: [65005], authors: [pubKey] },
        {
          kinds: [65001],
          authors: [
            'c70735fa4b01f77f953883a6e671982e31bd7d906b2b6111a6f518555bed1b1a',
          ],
          '#p': [pubKey],
        },
      ],
    );
    sub.on('event', (event) => {
      allEvents.add(event);
      setEvents([...allEvents]);
    });
  }, []);
  return events;
};

export default useImageJob;
