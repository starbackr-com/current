import { useEffect, useState } from 'react';
import { pool } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';
import {
  decryptAgentResponse,
  getAgentReponseTypeAndData,
} from '../utils/agents';
import { useAppSelector } from '../../../hooks';
import useAppState from '../../../hooks/useAppState';

const useAgentChat = (agentPublicKey) => {
  const [messages, setMessages] = useState([]);
  const pk = useAppSelector((state) => state.auth.pubKey);
  const { readUrls } = useRelayUrls();
  const appState = useAppState();

  useEffect(() => {
    let sub;
    if (appState === 'active') {
      const knownIds = messages.map((item) => item.response.id);
      sub = pool.sub(
        readUrls,
        [
          { kinds: [4], authors: [pk], '#p': [agentPublicKey] },
          { kinds: [4, 7000], authors: [agentPublicKey], '#p': [pk] },
        ],
        { skipVerification: true },
      );
      sub.on('event', async (event) => {
        if (!knownIds.includes(event.id)) {
          // @ts-ignore
          if (event.kind === 7000) {
            setMessages((prev) =>
              [...prev, { type: 'text', response: event }].sort(
                (a, b) => b.response.created_at - a.response.created_at,
              ),
            );
          } else {
            const response = await decryptAgentResponse(event, agentPublicKey);
            const [type, data] = getAgentReponseTypeAndData(response);
            setMessages((prev) =>
              [...prev, { type, response, data }].sort(
                (a, b) => b.response.created_at - a.response.created_at,
              ),
            );
          }
        }
      });
    }
    return () => {
      if (sub) {
        sub.unsub();
      }
    };
  }, [appState]);

  return messages;
};

export default useAgentChat;
