import { getPublicKey, getEventHash, signEvent } from "nostr-tools";
import relay from "./initRelay";
import { Event } from "./Event";
import { store } from "../../store/store";
import { logIn } from "../../features/authSlice";
import { getValue, saveValue } from "../../utils/secureStore";
import { loginToWallet } from "../wallet";

export const getNIP5 = async (pubkey) => {
    if (relay.status === 1) {
        const allEvents = [];
        retries = 0;

        let sub = relay.sub([
            {
                authors: [pubkey],
                kinds: [0],
            },
        ]);

        sub.on("event", (event) => {
            const newEvent = new Event(event);
            allEvents.push(newEvent);
        });

        sub.on("eose", () => {
            const filtered = allEvents.filter((event) =>
                JSON.parse(event.content).hasOwnProperty("nip05")
            );
            const nip05Array = filtered.map(
                (event) => JSON.parse(event.content).nip05
            );
            const nip05 = nip05Array.filter((nip05) =>
                nip05.includes("@starbackr.me")
            )[0];
            return nip05;
        });
    } else {
        alert("Not connected to a relay...");
    }
};

export const loginWithNip5 = async () => {
    if (relay.status === 1) {
        const privKey = await getValue('privKey')
        const pubkey = getPublicKey(privKey)
        const allEvents = [];
        retries = 0;

        let sub = relay.sub([
            {
                authors: [pubkey],
                kinds: [0],
            },
        ]);

        sub.on("event", (event) => {
            const newEvent = new Event(event);
            allEvents.push(newEvent);
        });

        sub.on("eose", async () => {
            const filtered = allEvents.filter((event) =>
                JSON.parse(event.content).hasOwnProperty("nip05")
            );
            const nip05Array = filtered.map(
                (event) => JSON.parse(event.content).nip05
            );
            const nip05 = nip05Array.filter((nip05) =>
                nip05.includes("@starbackr.me")
            )[0];
            try {
                const username = nip05.split('@')[0]
                const { access_token } = await loginToWallet(privKey, username);
                await saveValue('username', username)
                store.dispatch(logIn({ bearer: access_token, username }));
            } catch (err) {
                console.log(err);
            }
        });
    } else {
        alert("Not connected to a relay...");
    }
};

export const setNip05 = async (username, domain) => {
    try {
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
                name: username,
                nip05: `${username}@${domain}`,
            }),
        };
        event.id = getEventHash(event);
        event.sig = signEvent(event, privKey);

        let pub = relay.publish(event);

        pub.on("ok", () => {
            alert(`${relay.url} has accepted our event`);
        });
        pub.on("seen", () => {
            console.log(`we saw the event on ${relay.url}`);
        });
        pub.on("failed", (reason) => {
            console.log(`failed to publish to ${relay.url}: ${reason}`);
        });
    } catch (err) {
        console.log(err);
    }
};
