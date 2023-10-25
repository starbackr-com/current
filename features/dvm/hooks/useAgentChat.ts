import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { pool } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';
import Message from '../../../utils/nostrV2/Message';
import { dbAddMessage, getMessagesFromDb } from '../../../utils/database';
import devLog from '../../../utils/internal';
import { getValue } from '../../../utils';
import { checkAgentReponseType, decryptAgentResponse, getAgentReponseTypeAndData } from '../utils/agents';

const useAgentChat = (agentPublicKey) => {
  const [messages, setMessages] = useState([]);
  const pk = useSelector((state) => state.auth.pubKey);
  const { readUrls } = useRelayUrls();

  useEffect(() => {
    const knownIds = [];
    const sub = pool.sub(
      readUrls,
      [
        { kinds: [4], authors: [pk], '#p': [agentPublicKey] },
        { kinds: [4], authors: [agentPublicKey], '#p': [pk] },
      ],
      { skipVerification: true },
    );
    sub.on('event', async (event) => {
      if (!knownIds.includes(event.id)) {
        const response = await decryptAgentResponse(event, agentPublicKey);
        const [type, data] = getAgentReponseTypeAndData(response);
        setMessages((prev) =>
          [...prev, { type, response, data }].sort(
            (a, b) => b.response.created_at - a.response.created_at,
          ),
        );
      }
    });
    return () => {
      if (sub) {
        sub.unsub();
      }
    };
  }, []);

  return messages;
};

export default useAgentChat;
