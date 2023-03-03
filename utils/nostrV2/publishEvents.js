import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { getValue } from "../secureStore";
import { connectedRelays } from "./relay";

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
            name: name || nip05.split("@")[0],
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
                }, 10000);
            });
        })
    );

    return successes
        .filter((promise) => promise.status === "fulfilled")
        .map((promise) => promise.value);
};

export const publishEvent = async (content, tags) => {
    try {
        let privKey = await getValue("privKey");
        if (!privKey) {
            throw new Error("No privKey in secure storage found");
        }
        let pubKey = getPublicKey(privKey);
        let event = {
            kind: 1,
            pubkey: pubKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: tags || [],
            content,
        };

        try {
            let tags = (event.tags? event.tags: []);
            const hashtags = event.content.split(' ').filter(v=> v.startsWith('#'));
            console.log(hashtags);
            hashtags.forEach(tag => {tags.push(["t", tag.replace(/^#/, '')]);});
            event.tags = tags;

        } catch (e) {
              console.log('error in setting up hashtags', e);
        }

        try {

            if (event.content.includes("Current")) {

                const value = await AsyncStorage.getItem('appId');
                  console.log(value);
                event.tags.push(["id", value]);
            } else {
              console.log('no current');
            }



        } catch (e) {
          console.log('error in setting up appId', e);
        }


        event.id = getEventHash(event);
        event.sig = signEvent(event, privKey);
        const successes = await Promise.allSettled(
            connectedRelays.map((relay) => {
                return new Promise((resolve, reject) => {
                    let pub = relay.publish(event);
                    const timer = setTimeout(() => {
                        reject()
                    }, 10000)
                    pub.on("ok", () => {
                        clearTimeout(timer);
                        resolve(relay.url);
                        return;
                    });
                    pub.on("failed", (error) => {
                        cconsole.log(`${error} from ${relay.url}`);
                        clearTimeout(timer);
                        reject();
                        return;
                    });
                });
            })
        ).then((result) =>
            result
                .filter((promise) => promise.status === "fulfilled")
                .map((promise) => promise.value)
        );
        return { successes, event };
    } catch (err) {
        console.log(err);
    }
};

export const publishReply = async (content, parentEvent) => {
    try {
        const sk = await getValue("privKey");
        if (!sk) {
            throw new Error("No privKey in secure storage found");
        }
        let pk = getPublicKey(sk);
        let event = {
            kind: 1,
            pubkey: pk,
            created_at: Math.floor(Date.now() / 1000),
            tags: [['e', parentEvent]],
            content,
        };
        event.id = getEventHash(event);
        event.sig = signEvent(event, sk);
        const successes = await Promise.allSettled(
            connectedRelays.map((relay) => {
                return new Promise((resolve, reject) => {
                    let pub = relay.publish(event);
                    const timer = setTimeout(() => {
                        reject()
                    }, 10000)
                    pub.on("ok", () => {
                        clearTimeout(timer);
                        resolve(relay.url);
                        return;
                    });
                    pub.on("failed", (error) => {
                        console.log(error);
                        clearTimeout(timer);
                        reject();
                        return;
                    });
                });
            })
        ).then((result) =>
            result
                .filter((promise) => promise.status === "fulfilled")
                .map((promise) => promise.value)
        );
        return { successes, event };
    } catch (error) {
        console.log(error);
    }
};

export const createZapEvent = async (content, tags) => {

        try {



          const sk = await getValue("privKey");
          let pk = getPublicKey(sk);

          let addrelays = [];
          connectedRelays.map((relay) => { addrelays.push(relay.url); console.log(relay.url); });

          tags.push(['relays', addrelays[0], addrelays[1], addrelays[2], addrelays[3] ]);


          let event = {
              kind: 9734,
              pubkey: pk,
              created_at: Math.floor(Date.now() / 1000),
              tags: tags,
          };

          if (content) {

            event.content = content;
          } else {
            event.content = '';
          }
          event.id = getEventHash(event);
          event.sig = signEvent(event, sk);

          return event;


        } catch (e) {

          console.log('error: ', e);
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
        content: JSON.stringify({deleted:true,name:"nobody",about:"account deleted"}),
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
                }, 10000);
            });
        })
    );

    return successes
        .filter((promise) => promise.status === "fulfilled")
        .map((promise) => promise.value);
};
