import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { connectedRelays, Note } from "../../../utils/nostrV2";
import { connectedRelayPool, pool } from "../../../utils/nostrV2/relayPool";

export const useNoteMentions = () => {
    const [data, setData] = useState([]);
    const pk = useSelector((state) => state.auth.pubKey);
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);

    useEffect(() => {
        const urls = connectedRelayPool.map((relay) => relay.url);
        let sub = pool.sub(urls, [
            {
                kinds: [1],
                "#p": [pk],
            },
        ]);
        sub.on("event", (event) => {
            if (!mutedPubkeys.includes(event.pubkey)) {
                const newEvent = new Note(event);
                const parsedEvent = newEvent.save();
                setData((prev) => [...prev, parsedEvent].sort((a,b) => b.created_at - a.created_at));
            }
        });
    }, []);

    return data;
};
