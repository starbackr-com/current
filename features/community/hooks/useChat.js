import { useEffect, useState } from 'react';
import { pool } from '../../../utils/nostrV2';

const useChat = (communityObject) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const newMessages = new Set();
    const sub = pool.sub(
      ['wss://spool.chat'],
      [{ kinds: [9], '#g': [communityObject.communitySlug] }],
      { skipVerification: true },
    );
    sub.on('event', (event) => {
      newMessages.add(event);
      setMessages([...newMessages].sort((a, b) => b.created_at - a.created_at));
    });
    return () => {
      sub.unsub();
    };
  }, []);
  return messages;
};

export default useChat;
