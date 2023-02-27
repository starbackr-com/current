import { Zap } from "../../features/zaps/Zap";
import { store } from "../../store/store";
import { connectedRelays } from "./relay";
import { connectedRelayPool } from "./relayPool";
import { Reply } from "./Reply";

export const getReplies = async (parentIds) => {
    const mutedPubkeys = store.getState().user.mutedPubkeys;
    const replies = {};
    await Promise.allSettled(
        connectedRelayPool.map(
            (relay) =>
                new Promise((resolve, reject) => {
                    let events = [];
                    let sub = relay.sub([
                        {
                            kinds: [1, 9735],
                            "#e": parentIds,
                        },
                    ]);
                    sub.on("event", (event) => {
                        if (mutedPubkeys.includes(event.pubkey)) {
                            return;
                        } else {
                            if (event.kind === 1) {
                                const reply = new Reply(event);
                                events.push(reply);
                            } else if (event.kind === 9735) {
                                const zap = new Zap(event);
                                events.push(zap);
                            }
                        }
                    });
                    sub.on("eose", () => {
                        sub.unsub();
                        resolve(events);
                    });
                    setTimeout(() => {
                        resolve(events);
                    }, 5000);
                })
        )
    ).then((result) =>
        result.map((result) =>
            result.value.map((reply) => {
                replies[reply.id] = reply;
            })
        )
    );
    return replies;
};