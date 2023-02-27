import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Zap } from "../features/zaps/Zap";
import { Reply } from "../utils/nostrV2/Reply";
import { connectedRelays } from "../utils/nostrV2";

export const useSubscribeReplies = (parentIds) => {
    const [replies, setReplies] = useState({});
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);
    useEffect(() => {
        let subs = connectedRelays.map((relay) => {
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
                        if (replies[reply.id]) {
                            return;
                        } else {
                            setReplies((prev) => ({
                                ...prev,
                                [reply.id]: reply,
                            }));
                        }
                    } else if (event.kind === 9735) {
                        const zap = new Zap(event);
                        if (replies[zap.id]) {
                            return;
                        } else {
                            setReplies((prev) => ({
                                ...prev,
                                [zap.id]: zap,
                            }));
                        }
                    }
                }
            });
            return sub;
        });

        setTimeout(() => {
            console.log('Unsubbing from Timeout')
            subs.forEach((sub) => sub.unsub());
        }, 15000);

        // Unsub on Dismount
        return () => {
            console.log('Unsubbing from Dismount')
            subs.forEach((sub) => sub.unsub());
        };
    }, []);
    return replies;
};
