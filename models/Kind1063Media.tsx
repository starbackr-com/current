import { getTagValue } from '../utils/nostrV2/tags';

export class Kind1063Media {
  id: string;
  caption: string;
  createdAt: string;
  kind: number;
  pubkey: string;
  tags: string[][] | [];
  sig: string;
  url: string;
  type: string;
  blurhash?: string;
  dimensions?: number[];

  constructor(eventData) {
    this.id = eventData.id;
    this.caption = eventData.content;
    this.createdAt = eventData.created_at;
    this.kind = eventData.kind;
    this.pubkey = eventData.pubkey;
    this.sig = eventData.sig;
    this.tags = eventData.tags;
    this.url = getTagValue(eventData, 'url');
    this.type = getTagValue(eventData, 'm');
    this.blurhash = getTagValue(eventData, 'blurhash');
    this.dimensions = getTagValue(eventData, 'dim')
      ?.split('x')
      .map((item) => +item);
  }
}
