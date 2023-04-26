import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { pool } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';
import Message from '../../../utils/nostrV2/Message';

const useMessages = (partnerPubkey, sk) => {
  const [messages, setMessages] = useState([]);
  const pk = useSelector((state) => state.auth.pubKey);
  const { readUrls } = useRelayUrls();

  useEffect(() => {
    const sub = pool.sub(readUrls, [
      { kinds: [4], authors: [pk], '#p': [partnerPubkey] },
      { kinds: [4], authors: [partnerPubkey], '#p': [pk] },
    ]);
    sub.on('event', async (event) => {
      const message = await new Message(event).decrypt(pk, sk);
      setMessages((prev) => [...prev, message].sort((a, b) => b.created_at - a.created_at));
    });
    return () => {
      sub.unsub();
    };
  }, []);

  return messages;
};

export default useMessages;
