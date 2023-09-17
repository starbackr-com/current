import { Event } from 'nostr-tools';
import { imageRegex } from '../constants';

function parseAndReplaceImages(event: Event): [string, string[]] {
  const images: string[] = [];
  const parsedContent = event.content.replace(imageRegex, (match) => {
    images.push(match);
    return '';
  });
  return [parsedContent, images];
}

function parseReplyRootMention(event: Event): [string?, string?, string?] {
  let reply = null;
  let root = null;
  let mention = null;

  const replyTags: string[] = [];
  const rootTags: string[] = [];
  const mentionTags: string[] = [];

  for (const tag of event.tags) {
    if (tag[0] !== 'e') continue;
    if (tag[3] === 'root') {
      rootTags.push(tag[1]);
    } else if (tag[3] === 'reply') {
      replyTags.push(tag[1]);
    } else if (tag[3] === 'mention') {
      mentionTags.push(tag[1]);
    }
  }
  if (mentionTags.length > 0) {
    mention = mentionTags[0];
  }
  if (rootTags.length > 0) {
    root = rootTags[0];
    reply = replyTags.length > 0 ? replyTags[0] : rootTags[0];
  } else if (replyTags.length > 0) {
    root = reply = replyTags[0];
  } else if (event.tags.length > 0) {
    const eTags = event.tags.filter((tag) => tag[0] === 'e');
    if (eTags.length > 0) {
      reply = eTags[eTags.length - 1][1];
      root = eTags[0][1];
    }
  }

  return [reply, root, mention];
}

export class Kind1Note {
  content: string;
  images: string[];
  id: string;
  pubkey: string;
  createdAt: number;
  tags: string[][] | [];
  kind: number;
  repliesTo?: string;
  root?: string;
  mentions?: string;
  sig: string;

  constructor(event: Event) {
    this.createdAt = event.created_at;
    this.id = event.id;
    this.pubkey = event.pubkey;
    this.kind = event.kind;
    this.tags = event.tags;
    this.sig = event.sig;
    [this.content, this.images] = parseAndReplaceImages(event);
    [this.repliesTo, this.root, this.mentions] = parseReplyRootMention(event);
  }
}

export default Kind1Note;
