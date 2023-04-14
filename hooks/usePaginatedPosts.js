/* eslint-disable operator-assignment */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';
import { Note } from '../utils/nostrV2';
import { useRelayUrls } from '../features/relays';
import { pool } from '../utils/nostrV2/relays.ts';

export const usePaginatedPosts = (pubkeyHexArray) => {
  let mounted = true;
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalUntil, setGlobalUntil] = useState(Math.floor(Date.now() / 1000));
  const { readUrls } = useRelayUrls();
  let timer;

  const get25Posts = async () => {
    setIsLoading(true);
    let loops = 0;
    let until = globalUntil;
    let since = until - 7200;
    const results = [];
    while (results.length < 25 && loops < 10 && mounted) {
      loops += 1;
      await new Promise((resolve) => {
        const sub = pool.sub(
          readUrls,
          [
            {
              authors: pubkeyHexArray,
              kinds: [1],
              until,
              since,
            },
          ],
          { skipVerification: true },
        );
        const next = () => {
          const set = new Set([...events, ...results]);
          setEvents([...set].sort((a, b) => b.created_at - a.created_at));
          resolve();
          sub.unsub();
        };
        timer = setTimeout(next, 2000);

        sub.on('event', (event) => {
          clearTimeout(timer);
          const newEvent = new Note(event).save();
          results.push(newEvent);
          timer = setTimeout(next, 2000);
        });
      });
      until = until - 7200;
      since = since - 7200;
    }
    setGlobalUntil(until);
    setIsLoading(false);
  };

  useEffect(() => {
    get25Posts();
    return () => {
      mounted = false;
    };
  }, []);

  return [get25Posts, events, isLoading];
};

export default usePaginatedPosts;
