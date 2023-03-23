import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Note, connectedRelayPool, pool } from "../../../utils/nostrV2";

export const useHeaderNotes = (parentEvent) => {
    const [root, setRootEvent] = useState();
    const [parent, setParentEvent] = useState();
    const mutedPubkeys = useSelector((state) => state.user.mutedPubkeys);
    const urls = connectedRelayPool.map((relay) => relay.url);

    useEffect(() => {
        let ids;
        const parentETags = parentEvent.tags.filter((tag) => tag[0] === "e");
        if (parentETags.length > 0) {
            ids = [parentEvent.id, parentETags[0][1]];
        } else {
            ids = [parentEvent.id];
        }
        const sub = pool.sub(urls, [
            {
                ids,
            },
        ]);

        sub.on("event", (event) => {
            const note = new Note(event);
            const parsedNote = note.save();
            console.log(event);
            if (parsedNote.id === parentEvent.id) {
                setParentEvent(parsedNote);
            } else if (parsedNote.id === parentETags[0][1]) {
                setRootEvent(parsedNote);
            }
        });
    }, []);

    return { parent, root };
};
