import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { connectedRelays, Note, urls } from "../../../utils/nostrV2";
import { connectedRelayPool, pool } from "../../../utils/nostrV2/relayPool";

export const useNoteMentions = () => {
    const [data, setData] = useState([]);
    const pk = useSelector((state) => state.auth.pubKey);
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);

    const receivedEventIds = [];

    useEffect(() => {
        let subs = connectedRelays.map((relay) => {
            let sub = relay.sub([
                {
                    kinds: [1],
                    "#p": [pk],
                },
            ]);
            sub.on("event", (event) => {
                if (mutedPubkeys.includes(event.pubkey)) {
                    return;
                } else {
                    if (!receivedEventIds.includes(event.id)) {
                        receivedEventIds.push(event.id)
                        const newEvent = new Note(event).save();
                        setData((prev) => [...prev, newEvent]);
                    }
                }
            });
            return sub;
        });
        return () => {
            subs.forEach((sub) => sub.unsub());
        };
    }, []);

    return data;
};
