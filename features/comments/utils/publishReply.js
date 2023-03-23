import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { connectedRelayPool, pool } from "../../../utils/nostrV2/relayPool";
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
      reply.id = getEventHash(reply)
      reply.sig = signEvent(reply, sk)
    const urls = connectedRelayPool.map(relay => relay.url)
    const success = await new Promise((resolve, reject) => {
        let pubs = pool.publish(urls, reply)
        let timer = setTimeout(() => {
            reject();
            return;
        }, 5000)
        pubs.on('ok', () => {
            clearTimeout(timer)
            resolve(true)
    })
    })
    return success
} catch(e) {
    console.log(e)
}
};