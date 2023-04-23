import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { pool } from '../../../utils/nostrV2';

const useMessages = (partnerPubkey) => {
  const [messages, setMessages] = useState([]);
  const pk = useSelector((state) => state.auth.pubKey);
  const { readRelays } = useSelector((state) => state.relays.relays);

  useEffect(() => {
    const sub = pool.sub(readRelays, [
      { kinds: [4], authors: [pk], '#p': [partnerPubkey] },
      { kinds: [4], authors: [partnerPubkey], '#p': [pk] },
    ]);
    sub.on('event', (event) => {
      setMessages((prev) => [...prev, event].sort((a, b) => b.created_at - a.created_at));
    });
    return () => {
      sub.unsub();
    };
  }, []);

  return messages;
};

export default useMessages;
