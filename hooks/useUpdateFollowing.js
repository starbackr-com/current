import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectedRelayPool, pool } from "../utils/nostrV2";
import { useFollowUser } from "./useFollowUser";
import { addRelays } from "../features/userSlice";

export const useUpdateFollowing = () => {
    const pk = useSelector((state) => state.auth.pubKey);
    const dispatch = useDispatch();
    const { follow } = useFollowUser();

    const getFollowingList = async () => {
        const urls = connectedRelayPool.map((relay) => relay.url);
        const receivedEvents = [];

        const sub = pool.sub(
            urls,
            [
                {
                    kinds: [3],
                    authors: [pk],
                },
            ],
            { skipVerification: true }
        );
        const event = await new Promise((resolve) => {
            sub.on("event", (event) => {
                console.log(event);
                receivedEvents.push(event);
            });
            sub.on("eose", () => {
                const [newestEvent] = receivedEvents.sort(
                    (a, b) => b.created_at - a.created_at
                );
                resolve(newestEvent);
            });
        });
        sub.unsub();
        if (event) {
            const pubkeys = event.tags.map((tag) => tag[1]);
        console.log(`Following ${pubkeys.length} keys from kind 3...`);
        try {
            const relays = JSON.parse(event.content);
            dispatch(addRelays(relays));
        } catch (e) {
            console.log('Could not parse relays from kind 3');
        }
        return pubkeys;
        }
        return []
    };

    const updateFollowers = async () => {
        const pubkeys = await getFollowingList();
        if (pubkeys.length > 0) {
            follow(pubkeys);
        }
    };

    useEffect(() => {
        updateFollowers();
        // Unsub on Dismount
        return () => {};
    }, []);
};
