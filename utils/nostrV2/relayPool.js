import {SimplePool} from 'nostr-tools'

export let connectedRelayPool;

export const pool = new SimplePool()

export const initRelayPool = async () => {
    const response = await fetch(process.env.BASEURL + "/relays");
    const data = await response.json();
    const urls = data.result;
    connectedRelayPool = await Promise.allSettled(
        urls.map((url) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const relay = await pool.ensureRelay(url.relay)
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
