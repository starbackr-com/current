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
  const filter1 = {
    kinds: [4],
    authors: [pk],
  };
  const filter2 = {
    kinds: [4],
    '#p': [pk],
  };
  useEffect(() => {
    if (timing > 0) {
      filter1.since = now - timing;
      filter2.since = now - timing;
    }
    const sub = pool.sub(readUrls, [filter1, filter2], {
      skipVerification: true,
    });
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
