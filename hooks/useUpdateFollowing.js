import { useEffect } from "react";
import { useSelector } from "react-redux";
import { connectedRelays } from "../utils/nostrV2";
import { useFollowUser } from "./useFollowUser";

export const useUpdateFollowing = () => {
    const pk = useSelector((state) => state.auth.pubKey);
    const { follow } = useFollowUser();

    const getFollowingList = async () => {
        const replies = {};
        const response = await fetch("https://getcurrent.io/relays");
        const data = await response.json();

        const currentRelay = connectedRelays.filter(
            (relay) => relay.url === data.result[0].relay
        );
        let sub = currentRelay[0].sub([
            {
                kinds: [3],
                authors: [pk],
            },
        ]);
        const tags = await new Promise((resolve) => {
            sub.on("event", (event) => {
                resolve(event.tags);
            });
        });
        sub.unsub();
        const pubkeys = tags.map((tag) => tag[1]);
        console.log(`Following ${pubkeys.length} keys from kind 3...`);
        return pubkeys;
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
