import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { connectedRelays, Note } from "../../../utils/nostrV2";

export const useNoteMentions = () => {
    const [data, setData] = useState({});
    const pk = useSelector((state) => state.auth.pubKey);
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);
    const receivedIds = [];

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
                    if (!receivedIds.includes(event.id)) {
                        receivedIds.push(event.id)
                        const newEvent = new Note(event);
                        const parsedEvent = newEvent.save();
                        setData((prev) => ({
                            ...prev,
                            [parsedEvent.id]: parsedEvent,
                        }));
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

    return [data]
};
