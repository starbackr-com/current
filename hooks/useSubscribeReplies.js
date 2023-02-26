import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Zap } from "../features/zaps/Zap";
import { Reply } from "../utils/nostrV2/Reply";
import { connectedRelays } from "../utils/nostrV2";

export const useSubscribeReplies = (parentIds) => {
    const [data, setData] = useState(0);
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);
    console.log(data);
    useEffect(() => {
        let subs = connectedRelays.map((relay) => {
            let sub = relay.sub([
                {
                    kinds: [1],
                    "#e": parentIds,
                },
            ]);
            sub.on("event", (event) => {
                if (mutedPubkeys.includes(event.pubkey)) {
                    return;
                } else {
                    if (event.kind === 1) {
                        const reply = new Reply(event);
                        console.log('EVENT!');
                    } else if (event.kind === 9735) {
                        const zap = new Zap(event);
                        events.push(zap);
                    }
                }
            });
            return sub;
        });

        // Unsub on Dismount
        return () => {
            subs.forEach((sub) => sub.unsub());
        };
    }, []);
};