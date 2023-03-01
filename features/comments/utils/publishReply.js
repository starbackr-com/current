import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { relays } from "../../../utils/nostrV2";
import { pool } from "../../../utils/nostrV2/relayPool";
import { getValue } from "../../../utils/secureStore";

export const publishReply = async (content, event) => {
try {
    const oldETags = event.tags.filter(tag => tag[0] === 'e')
    const oldPTags = event.tags.filter(tag => tag[0] === 'p')

    const replyETags = oldETags.length > 0 ? [oldETags[0], ['e', event.id, 'reply']] : [['e', event.id, 'reply']]
    const replyPTags =  oldPTags ? [...oldPTags, ['p', event.pubkey]] : [['p', event.pubkey]]
    const sk = await getValue('privKey')
    const pk = getPublicKey(sk)

    let reply = {
        kind: 1,
        pubkey: pk,
        created_at: Math.floor(Date.now() / 1000),
        tags: [...replyETags, ...replyPTags],
        content
      }
      console.log(reply)
      reply.id = getEventHash(reply)
      reply.sig = signEvent(reply, sk)
    const urls = relays.map(relay => relay.url)

    let pubs = pool.publish(urls, reply)
    console.log(pubs)
} catch(e) {
    console.log(e)
}
};