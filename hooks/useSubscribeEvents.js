import { useEffect, useState } from 'react';
import { Note, pool } from '../utils/nostrV2';
import { useRelayUrls } from '../features/relays';

const useSubscribeEvents = (pubkeysinHex) => {
  const [events, setEvents] = useState([]);
  const { readUrls } = useRelayUrls();

  const eventCallback = (event) => {
    const newEvent = new Note(event);
    const parsedEvent = newEvent.save();
    setEvents((prev) => [...prev, parsedEvent].sort((a, b) => b.created_at - a.created_at));
  };

  useEffect(() => {
    const sub = pool.sub(
      readUrls,
      [
        {
          kinds: [1],
          authors: pubkeysinHex,
          limit: 50,
        },
      ],
      { skipVerification: true },
    );
    sub.on('event', eventCallback);
  }, []);

  return events;
};

export default useSubscribeEvents;
