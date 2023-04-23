import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRelayUrls } from '../../relays';
import { pool } from '../../../utils/nostrV2';

const useConversations = () => {
  const { readUrls } = useRelayUrls();
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
        },
        { kinds: [4], '#p': [pk] },
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
  }, []);
  return activeConversation;
};

export default useConversations;
