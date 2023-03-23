import { useEffect } from "react";
import { useSelector } from "react-redux";
import { pool } from "../utils/nostrV2";
import { useFollowUser } from "./useFollowUser";

export const useUpdateFollowing = () => {
    const pk = useSelector((state) => state.auth.pubKey);
    const { follow } = useFollowUser();

    const getFollowingList = async () => {
        const response = await fetch(process.env.BASEURL + "/relays");
        const data = await response.json();

        const sub = pool.sub(
            [data.result[0].relay],
            [
                {
                    kinds: [3],
                    authors: [pk],
                },
            ], {skipVerification: true}
        );
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
