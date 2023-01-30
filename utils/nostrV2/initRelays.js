import { relayInit } from "nostr-tools";

export let relays;
export let connectedRelays;

export const initRelays = async () => {
    const response = await fetch('https://getcurrent.io/relays')
    const data = await response.json();
    const urls = data.result

    relays = urls.map(url => relayInit(url.relay))
    connectedRelays = await Promise.allSettled(
        relays.map((relay) => {
            return new Promise(async (resolve, reject) => {
                try {
                    await relay.connect();
                    relay.on("connect", () => {
                        console.log(`Connected to ${relay.url}`);
                        resolve(relay);
                    });
                    relay.on("error", () => {
                        console.log(`Failed to connect to ${relay.url}`);
                        reject();
                    });
                } catch (e) {
                    console.log(e);
                }
            });
        })
    ).then((result) =>
        result
            .filter((promise) => promise.status === "fulfilled")
            .map((promise) => promise.value)
    );

};