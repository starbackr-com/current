import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { getPrivateKey } from "../../../utils/cache/asyncStorage";
import { pool } from "../../../utils/nostrV2";
import { signRawEvent } from "../../../utils";

export async function publishJoinEvent(communitySlug: string) {
  const sk = await getPrivateKey();
  const pk = getPublicKey(sk);
  const event = {
    kind: 9000,
    tags: [
        ["g", communitySlug],
        ["action", "add", pk, "user"],
    ],
    content: "Testing",
    created_at: Math.floor(Date.now() / 1000),
    pubkey: pk,
    id: '',
    sig: ''
};
event.id = getEventHash(event);
event.sig = signEvent(event, sk);
console.log(event);
return new Promise((resolve, reject) => {
  const pub = pool.publish(['wss://spool.chat'], event);
  pub.on('ok', resolve);
  pub.on('failed', reject);
})
};

export async function publishCommunityMessage(content: string, communitySlug: string) {+
  console.log('got here!')
  const event = {
    kind: 9,
    content,
    tags: [['g', communitySlug]],
    created_at: Math.floor(Date.now() / 1000),
  }
  const signedEvent = await signRawEvent(event)
  console.log(signedEvent); 
  return new Promise<void>((resolve, reject) => {
    const pub = pool.publish(['wss://spool.chat'], signedEvent);
    pub.on('ok', () => {resolve()});
    pub.on('failed', (reason: string) => {reject(reason)});
  })
};