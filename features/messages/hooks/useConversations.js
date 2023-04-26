import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRelayUrls } from '../../relays';
import { pool } from '../../../utils/nostrV2';

const useConversations = (timing) => {
  const { readUrls } = useRelayUrls();
  const now = Math.floor(Date.now() / 1000);
  const pk = useSelector((state) => state.auth.pubKey);
  const [activeConversation, setActiveConversations] = useState();
  const authors = new Set();
  useEffect(() => {
    const sub = pool.sub(
      readUrls,
      [
        {
          kinds: [4],
          authors: [pk],
          since: now - timing,
        },
        {
          kinds: [4],
          '#p': [pk],
          since: now - timing,
        },
      ],
      { skipVerification: true },
    );
    sub.on('event', (event) => {
      if (event.pubkey === pk) {
        authors.add(event.tags[0][1]);
        setActiveConversations([...authors]);
      } else {
        authors.add(event.pubkey);
        setActiveConversations([...authors]);
      }
    });
    return () => {
      sub.unsub();
    };
  }, [timing]);
  return activeConversation;
};

export default useConversations;
