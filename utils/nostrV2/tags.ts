import { Event } from "nostr-tools";

export function getTagValue(event: Event, tagIdentifier: string ,valueIndex: number = 1): string | undefined {
  const tag = event.tags.find(tag => tag[0] === tagIdentifier);
  if(!tag) {
    return undefined
  }
  return tag[valueIndex]
}