import {SimplePool} from 'nostr-tools'

export let connectedRelayPool;

export const pool = new SimplePool()

export const initRelayPool = async () => {
    // const response = await fetch("https://getcurrent.io/relays");
    // const data = await response.json();
    // const urls = data.result;

    const urls = ['wss://relay.current.fyi', 'wss://relay.nostrati.com', 'wss://nostr.mom', 'wss://nostr-pub.wellorder.net', 'wss://nos.lol', 'wss://nostr-verified.wellorder.net', 'wss://nostr.cro.social']
    connectedRelayPool = await Promise.allSettled(
        urls.map((url) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const relay = await pool.ensureRelay(url)
                    resolve(relay)
                } catch (e) {
                    console.log(e);
                    reject()
                }
            });
        })
    ).then((result) =>
        result
            .filter((promise) => promise.status === "fulfilled")
            .map((promise) => promise.value)
    );
};
