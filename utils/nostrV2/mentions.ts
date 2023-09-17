import { nip19 } from "nostr-tools";
import { mentionRegex } from "../../constants";

export function parseInputMentions(content: string) {
  const fullMentions = [...content.matchAll(mentionRegex)];
  const mentionArray = fullMentions.map((mention) => ['p', mention[2]]);
  const parsedContent = content.replaceAll(
    mentionRegex,
    (m, g1, g2) => `nostr:${nip19.npubEncode(g2)}`,
  );
  return {mentionArray, parsedContent};
}