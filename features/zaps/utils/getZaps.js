import { event } from "react-native-reanimated";
import { connectedRelays } from "../../../utils/nostrV2";
import { Zap } from "../Zap";

export const getZaps = async (eventIds) => {
    console.log(eventIds)
    const allZaps = {};
    const zapsPerPost = {}
    await Promise.allSettled(
        connectedRelays.map(
            (relay) =>
                new Promise((resolve, reject) => {
                    let zaps = [];
                    let sub = relay.sub([{ kinds: [9735], "#e": eventIds }]);
                    let timer = setTimeout(() => {
                        resolve(zaps);
                        return;
                    }, 5000);
                    sub.on("event", (event) => {
                        const zap = new Zap(event);
                        zaps.push(zap);
                    });
                    sub.on("eose", () => {
                        clearTimeout(timer);
                        resolve(zaps);
                        return;
                    });
                })
        )
    ).then((result) =>
        result.map((result) =>
            result.value.map((zap) => {
                allZaps[zap.id] = zap;
            })
        )
    );
    const array = Object.keys(allZaps).map((key) => allZaps[key]);
    array.forEach(zap => {
        if (zapsPerPost[zap.toEvent]) {
            zapsPerPost[zap.toEvent].zaps.push(zap);
            zapsPerPost[zap.toEvent].amount += zap.amount
        } else {
            zapsPerPost[zap.toEvent] = {amount: zap.amount, zaps: [zap]}
        }
    })
    console.log(zapsPerPost)
    return zapsPerPost
};