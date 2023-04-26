import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Note } from '../../../utils/nostrV2';
import { Zap } from '../../zaps/Zap';
import { useRelayUrls } from '../../relays';
import { pool } from '../../../utils/nostrV2/relays.ts';

export const useReplies = (eventId) => {
  const [replies, setReplies] = useState([]);
  const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);
  const { readUrls } = useRelayUrls();

  const eventCallback = useCallback(
    (event) => {
      if (mutedPubkeys.includes(event.pubkey)) {
        return;
      }
      if (event.kind === 1) {
        const newEvent = new Note(event).saveReply();
        if (newEvent.repliesTo === eventId) {
          setReplies((prev) => [...prev, newEvent].sort((a, b) => b.created_at - a.created_at));
        }
      } else if (event.kind === 9735) {
        const newZap = new Zap(event);
        setReplies((prev) => [...prev, newZap].sort((a, b) => b.created_at - a.created_at));
      }
    },
    [mutedPubkeys],
  );

  useEffect(() => {
    const sub = pool.sub(readUrls, [
      {
        kinds: [1, 9735],
        '#e': [eventId],
      },
    ]);

    sub.on('event', eventCallback);
  }, []);
  return replies;
};

export default useReplies;
