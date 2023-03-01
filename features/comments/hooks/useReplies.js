import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Note, relays } from "../../../utils/nostrV2";
import { pool } from "../../../utils/nostrV2/relayPool";

export const useReplies = (eventId, now) => {
    const [replies, setReplies] = useState([]);
    const urls = relays.map((relay) => relay.url);
    useEffect(() => {
        const sub = pool.sub(urls, [
            {
                kinds: [1],
                "#e": [eventId],
            },
        ]);

        sub.on("event", (event) => {
            const note = new Note(event);
            const parsedEvent = note.save();
            setReplies((prev) => [...prev, parsedEvent]);
        });
    }, []);
    return replies;
};
