import { relayInit } from "nostr-tools";

export let relays;
export let connectedRelays;
export let urls

export const initRelays = async () => {
    const response = await fetch(process.env.BASEURL + "/relays");
    const data = await response.json();
    urls = data.result;

    relays = urls.map((url) => relayInit(url.relay));
    connectedRelays = await Promise.allSettled(
        relays.map((relay) => {
            return new Promise(async (resolve, reject) => {
                try {
                    relay.connect();
                    const timer = setTimeout(() => {
                        console.log(`${relay.url} timed out after 5 sec...`);
                        return reject();
                    }, 3000);
                    relay.on("connect", () => {
                        console.log(`Connected to ${relay.url}`);
                        clearTimeout(timer);
                        resolve(relay);
                        return;
                    });
                    relay.on("error", () => {
                        console.log(`Failed to connect to ${relay.url}`);
                        clearTimeout(timer);
                        reject();
                        return;
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

export const reconnectRelays = async () => {
    const unconnectedRelays = relays.filter((relay) => relay.status !== 1);
    const reconnectedRelays = await Promise.allSettled(
        unconnectedRelays.map(
            (relay) =>
                new Promise(async (resolve, reject) => {
                    try {
                        await relay.connect();
                        const timer = setTimeout(() => {
                            console.log(
                                `${relay.url} timed out after 5 sec...`
                            );
                            return reject();
                        }, 5000);
                        relay.on("connect", () => {
                            console.log(`Connected to ${relay.url}`);
                            clearTimeout(timer);
                            resolve(relay);
                            return;
                        });
                        relay.on("error", () => {
                            console.log(`Failed to connect to ${relay.url}`);
                            clearTimeout(timer);
                            reject();
                            return;
                        });
                    } catch (e) {
                        console.log(e);
                    }
                })
        )
    ).then((result) =>
        result
            .filter((promise) => promise.status === "fulfilled")
            .map((promise) => promise.value)
    );
    console.log(`Reconnected to ${reconnectedRelays.length} relays...`);
};

export const disconnectRelays = async () => {
    relays.forEach(async (relay) => await relay.close());
};
