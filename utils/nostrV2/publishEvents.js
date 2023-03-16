import AsyncStorage from "@react-native-async-storage/async-storage";
import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { getValue } from "../secureStore";

import { connectedRelayPool, pool } from "./relayPool";

export const publishKind0 = async (nip05, bio, imageUrl, lud16, name) => {
    let privKey = await getValue("privKey");
    if (!privKey) {
        throw new Error("No privKey in secure storage found");
    }
    let pubKey = getPublicKey(privKey);
    let event = {
        kind: 0,
        pubkey: pubKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: JSON.stringify({
            name: name || nip05.split("@")[0],
            nip05: nip05,
            about: bio,
            picture: imageUrl,
            lud16: lud16,
        }),
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, privKey);
    const successes = await Promise.allSettled(
        connectedRelays.map((relay) => {
            return new Promise((resolve, reject) => {
                let pub = relay.publish(event);
                pub.on("ok", () => {
                    resolve(relay.url);
                });
                pub.on("failed", () => {
                    reject();
                });
                setTimeout(() => {
                    reject();
                }, 3000);
            });
        })
    );

    return successes
        .filter((promise) => promise.status === "fulfilled")
        .map((promise) => promise.value);
};

export const publishEvent = async (content, tags) => {
    try {
        const privKey = await getValue("privKey");
        if (!privKey) {
            throw new Error("No privKey in secure storage found");
        }
        const pubKey = getPublicKey(privKey);
        const event = {
            kind: 1,
            pubkey: pubKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: tags || [],
            content,
        };

        try {
            const hashtags = event.content
                .split(" ")
                .filter((v) => v.startsWith("#"));
            hashtags.forEach((tag) => {
                event.tags.push(["t", tag.replace(/^#/, "")]);
            });
        } catch (e) {
            console.log("error in setting up hashtags", e);
        }

        try {
            if (event.content.includes("Current")) {
                const value = await AsyncStorage.getItem("appId");
                event.tags.push(["id", value]);
            } else {
                console.log("no current");
            }
        } catch (e) {
            console.log("error in setting up appId", e);
        }

        event.id = getEventHash(event);
        event.sig = signEvent(event, privKey);
        const urls = connectedRelayPool.map((relay) => relay.url);
        const pub = pool.publish(urls, event);
        await new Promise((resolve) => {
            let successes = 0;
            const timer = setTimeout(resolve, 2500);
            pub.on("ok", () => {
                successes++;
                if (successes === connectedRelayPool.length) {
                    clearTimeout(timer);
                    resolve();
                }
            });
        });
        return { event };
    } catch (err) {
        console.log(err);
    }
};

export const createZapEvent = async (content, tags) => {
    try {
        const sk = await getValue("privKey");
        let pk = getPublicKey(sk);

        let addrelays = [];
        connectedRelayPool.map((relay) => {
            addrelays.push(relay.url);
            console.log(relay.url);
        });

        tags.push([
            "relays",
            addrelays[0],
            addrelays[1],
            addrelays[2],
            addrelays[3],
        ]);

        let event = {
            kind: 9734,
            pubkey: pk,
            created_at: Math.floor(Date.now() / 1000),
            tags: tags,
        };

        if (content) {
            event.content = content;
        } else {
            event.content = "";
        }
        event.id = getEventHash(event);
        event.sig = signEvent(event, sk);

        return event;
    } catch (e) {
        console.log("error: ", e);
        return;
    }
};

export const publishDeleteAccount = async () => {
    let privKey = await getValue("privKey");
    if (!privKey) {
        throw new Error("No privKey in secure storage found");
    }
    let pubKey = getPublicKey(privKey);
    let event = {
        kind: 0,
        pubkey: pubKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: JSON.stringify({
            deleted: true,
            name: "nobody",
            about: "account deleted",
        }),
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, privKey);
    const successes = await Promise.allSettled(
        connectedRelayPool.map((relay) => {
            return new Promise((resolve, reject) => {
                let pub = relay.publish(event);
                pub.on("ok", () => {
                    resolve(relay.url);
                });
                pub.on("failed", () => {
                    reject();
                });
                setTimeout(() => {
                    reject();
                }, 10000);
            });
        })
    );

    return successes
        .filter((promise) => promise.status === "fulfilled")
        .map((promise) => promise.value);
};

export const publishRepost = async (eTag, pTag) => {
    const sk = await getValue("privKey");
    if (!sk) {
        throw new Error("No private key in secure storage found!");
    }
    const pk = getPublicKey(sk);
    const event = {
        kind: 6,
        pubkey: pk,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ["e", eTag, "", "root"],
            ["p", pTag],
        ],
        content: "",
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, sk);
    const urls = connectedRelayPool.map((relay) => relay.url);
    const pub = pool.publish(urls, event);
    await new Promise((resolve) => {
        let successes = 0;
        const timer = setTimeout(resolve, 2500);
        pub.on("ok", () => {
            successes++;
            if (successes === connectedRelayPool.length) {
                clearTimeout(timer);
                resolve();
            }
        });
    });
    alert("Success!");
};

export const publishReaction = async (sign, eTag, pTag) => {
    if (sign != "+" && sign != "-") {
        throw new Error("Invalid sign for reaction! Must be + or -");
    }
    const sk = await getValue("privKey");
    if (!sk) {
        throw new Error("No private key in secure storage found!");
    }
    const pk = getPublicKey(sk);
    const event = {
        kind: 7,
        pubkey: pk,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ["e", eTag],
            ["p", pTag],
        ],
        content: sign,
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, sk);
    const urls = connectedRelayPool.map((relay) => relay.url);
    const pub = pool.publish(urls, event);
    await new Promise((resolve) => {
        let successes = 0;
        const timer = setTimeout(resolve, 2500);
        pub.on("ok", () => {
            successes++;
            if (successes === connectedRelayPool.length) {
                clearTimeout(timer);
                resolve();
            }
        });
    });
    alert("Success!");
};
