import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Note, connectedRelays } from "../../../utils/nostrV2";

export const useHomefeed = (unixNow) => {
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState();
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);

    const receivedEventIds = [];

    // Setup pagination Function
    const setNewPage = (pageValue) => {
        setPage(pageValue);
    };

    const triggerRefresh = () => {
        setRefresh((prev) => !prev);
    };

    const eventCallback = useCallback((event) => {
        if (!receivedEventIds.includes(event.id)) {
            receivedEventIds.push(event.id);
            const newEvent = new Note(event);
            if (newEvent.checkRoot()) {
                const parsedEvent = newEvent.save();
                setData((prev) =>
                    [...prev, parsedEvent].sort(
                        (a, b) => b.created_at - a.created_at
                    )
                );
            }
        }
    }, []);

    useEffect(() => {
        const hoursInSeconds = 6 * 60 * 60;
        const until = Math.floor(unixNow - page * hoursInSeconds);
        const since = Math.floor(
            unixNow - hoursInSeconds - page * hoursInSeconds
        );
        let subs = connectedRelays.map((relay) => {
            let sub = relay.sub([
                {
                    kinds: [1],
                    authors: followedPubkeys,
                    until: until,
                    since: since,
                },
            ]);
            sub.on("event", eventCallback);
            return sub;
        });
        return () => {
            subs.forEach((sub) => sub.unsub());
        };
    }, [page, refresh]);

    return [data, page, setNewPage, triggerRefresh];
};
