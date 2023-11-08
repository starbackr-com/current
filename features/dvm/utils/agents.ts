import { Event, nip04 } from 'nostr-tools';
import { getTagValue } from '../../../utils/nostrV2/tags';
import { getPrivateKey } from '../../../utils/cache/asyncStorage';
import { imageRegex } from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AgentResponseTypes = 'invoice' | 'image' | 'movie' | 'text';

type DecryptedAgentResponse = Event;

export type SamplePrompts = {
  message_id: string;
  agent_id: string;
  prompt: string;
  response: string;
};

export type Agent = {
  id: string;
  title: string;
  description: string;
  category: string;
  symbol: string;
  examples: string[];
  placeholder: string;
  llmrouter: string;
  convocount: number;
  maxtoken: number;
  satspay: number;
  paid: boolean;
  createdby: string;
  chatruns: number;
  newagent: boolean;
  nip05: string;
  restricted: boolean;
};

type CategorizedAgents = {
  category: string;
  agents: Agent[];
};

export function sortAgentsByCategory(agents: Agent[]): CategorizedAgents[] {
  const categoryMap: { category: Agent[] } = {} as {
    category: Agent[];
  };
  for (let i = 0; i < agents.length; i++) {
    if (categoryMap[agents[i].category]) {
      categoryMap[agents[i].category].push(agents[i]);
    } else {
      categoryMap[agents[i].category] = [agents[i]];
    }
  }
  const categorizedArray = Object.keys(categoryMap).map((category) => ({
    category: category,
    agents: categoryMap[category] as Agent[],
  }));
  return categorizedArray;
}

export function excludeSensitiveAgents(agents: Agent[]): Agent[] {
  const filteredAgents = [] as Agent[];
  for (let i = 0; i < agents.length; i++) {
    if (!agents[i].restricted && agents[i].pubkey) {
      filteredAgents.push(agents[i]);
    }
  }
  return filteredAgents;
}

export class AgentResponse {
  type: AgentResponseTypes;
  agentKey: string;
  rawEvent: Event;
  message: string;
  invoice?: string;

  constructor(rawEvent: Event, decryptedMessage: string) {
    if (!rawEvent || !decryptedMessage) {
      throw new Error(
        'Invalid instantiation. Use init method to initialize AgentResponse',
      );
    }
    this.agentKey = rawEvent.pubkey;
    this.rawEvent = rawEvent;
    this.message = decryptedMessage;
    this.type = this.checkType();
  }
  async decrypt(): Promise<string> {
    const sk = await getPrivateKey();
    if (!sk) {
      throw new Error('Could not retrieve privatekey from secure storage');
    }
    return nip04.decrypt(sk, this.agentKey, this.rawEvent.content);
  }

  private checkType(): AgentResponseTypes {
    const invoice = getTagValue(this.rawEvent, 'invoice', 1);
    if (invoice) {
      return 'invoice';
    }
  }

  static async init(rawEvent: Event) {
    const sk = await getPrivateKey();
    if (!sk) {
      throw new Error('Could not retrieve privatekey from secure storage');
    }
    const message = await nip04.decrypt(sk, rawEvent.pubkey, rawEvent.content);
    return new AgentResponse(rawEvent, message);
  }
}

export async function decryptAgentResponse(
  event: Event,
  agentPublicKey: string,
): Promise<DecryptedAgentResponse> {
  const sk = await getPrivateKey();
  if (!sk) {
    throw new Error('Could not retrieve privatekey from secure storage');
  }
  const message = await nip04.decrypt(sk, agentPublicKey, event.content);
  return { ...event, content: message };
}

export function getAgentReponseTypeAndData(response: DecryptedAgentResponse) {
  const invoice = getTagValue(response, 'invoice', 1);
  if (invoice) {
    return ['invoice', invoice];
  }
  const images = response.content.match(imageRegex);
  if (images) {
    return ['image', images];
  }
  return ['text', response.content];
}

export async function agentIntroShown(agentKey) {
  const agentIntrosShownJson = await AsyncStorage.getItem('agentIntrosShown');
  console.log(agentIntrosShownJson);
  if (agentIntrosShownJson) {
    const parsedJson = JSON.parse(agentIntrosShownJson);
    if (parsedJson.length > 0 && !parsedJson.includes(agentKey)) {
      parsedJson.push(agentKey);
      await AsyncStorage.setItem(
        'agentIntrosShown',
        JSON.stringify(parsedJson),
      );
      return false;
    }
    return true;
  } else {
    const newArray = [agentKey];
    await AsyncStorage.setItem('agentIntrosShown', JSON.stringify(newArray));
    return false;
  }
}
