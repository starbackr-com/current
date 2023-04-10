import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Note } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';
import { pool } from '../../../utils/nostrV2/relays.ts';

const useNoteMentions = () => {
  const { readUrls } = useRelayUrls();
  const [data, setData] = useState([]);
  const pk = useSelector((state) => state.auth.pubKey);
  const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);

  const receivedEventIds = [];

  const eventCallback = useCallback(
    (event) => {
      if (mutedPubkeys.includes(event.pubkey)) {
        return;
      }
      if (!receivedEventIds.includes(event.id) && event.pubkey !== pk) {
        receivedEventIds.push(event.id);
        const newEvent = new Note(event).save();
        setData((prev) => [...prev, newEvent].sort((a, b) => b.created_at - a.created_at));
      }
    },
    [mutedPubkeys],
  );

  useEffect(() => {
    const sub = pool.sub(
      readUrls,
      [
        {
          kinds: [1],
          '#p': [pk],
        },
      ],
      { skipVerification: true },
    );
    sub.on('event', eventCallback);
    return () => {
      sub.unsub();
    };
  }, []);

  return data;
};

export default useNoteMentions;
