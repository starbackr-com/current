import { Event } from 'nostr-tools';
import { imageRegex } from '../constants';

export class Kind65005ImgRequest {
  content: string;
  id: string;
  pubkey: string;
  createdAt: number;
  tags: string[][] | [];
  kind: number;
  sig: string;
  data: string;
  inputType: 'url' | 'event' | 'job' | 'text';
  marker?: string;
  inputRelay?: string;
  output: string;
  bid?: number;
  relays?: string[];
  serviceProviders?: string[];

  constructor(event: Event) {
    this.createdAt = event.created_at;
    this.id = event.id;
    this.pubkey = event.pubkey;
    this.kind = event.kind;
    this.tags = event.tags;
    this.sig = event.sig;
  }
}

export default Kind1Note;
