import { useEffect, useState } from "react";
import { Note, connectedRelayPool, pool } from "../utils/nostrV2";

const useSubscribeEvents = (pubkeysinHex) => {
    const [events, setEvents] = useState([]);

    const eventCallback = (event) => {
        const newEvent = new Note(event);
        const parsedEvent = newEvent.save();
        setEvents((prev) =>
            [...prev, parsedEvent].sort((a, b) => b.created_at - a.created_at)
        );
    };

    useEffect(() => {
        const urls = connectedRelayPool.map((relay) => relay.url);

        const sub = pool.sub(
            ["wss://nos.lol"],
            [
                {
                    kinds: [1],
                    authors: pubkeysinHex,
                    limit: 50,
                },
            ],
            { skipVerification: true }
        );
        sub.on("event", eventCallback);
    }, []);

    return events;
};

export default useSubscribeEvents;
