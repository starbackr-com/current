import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { pool } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';
import Message from '../../../utils/nostrV2/Message';
import { dbAddMessage, getMessagesFromDb } from '../../../utils/database';
import devLog from '../../../utils/internal';
import { getValue } from '../../../utils';

const useMessages = (partnerPubkey) => {
  const [messages, setMessages] = useState([]);
  const pk = useSelector((state) => state.auth.pubKey);
  const { readUrls } = useRelayUrls();

  useEffect(() => {
    let sub;
    async function getMessages() {
      const sk = await getValue('privKey');
      const knownIds = [];
      try {
        const cachedMessages = await getMessagesFromDb(partnerPubkey);
        const cachedIds = cachedMessages.map((message) => message.id);
        setMessages([...cachedMessages].sort((a, b) => b.created_at - a.created_at));
        cachedIds.forEach((id) => knownIds.push(id));
      } catch (e) {
        devLog(e);
      }
      sub = pool.sub(
        readUrls,
        [
          { kinds: [4], authors: [pk], '#p': [partnerPubkey] },
          { kinds: [4], authors: [partnerPubkey], '#p': [pk] },
        ],
        { skipVerification: true },
      );
      sub.on('event', async (event) => {
        if (!knownIds.includes(event.id)) {
          const message = await new Message(event).decrypt(pk, sk);
          dbAddMessage(
            message.id,
            partnerPubkey,
            message.content,
            message.created_at,
            message.kind,
            message.pubkey,
            message.sig,
            message.tags,
          );
          setMessages((prev) => [...prev, message].sort((a, b) => b.created_at - a.created_at));
        }
      });
    }
    getMessages();
    return () => {
      if (sub) {
        sub.unsub();
      }
    };
  }, []);

  return messages;
};

export default useMessages;
