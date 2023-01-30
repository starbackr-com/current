// export const updateUsers = async (url) => {
//     const pubkeys = store.getState().user.followedPubkeys
//     if (relay.status === 1) {
//         let sub = relay.sub([
//             {
//                 authors: pubkeys,
//                 kinds: [0],
//             },
//         ]);

//         sub.on("event", (event) => {
//             const newEvent = new Event(event);
//             newEvent.save();
//         });
//         sub.on("eose", () => {
//             sub.unsub();
//         });
//     } else {
//         console.log("Not connected to a relay");
//     }
// };

// export const getUserData = (pubkey) => {
//     const promise = new Promise((resolve, reject) => {
//         try {
//             if (relay.status === 1) {
//                 console.log(pubkey);
//                 let lol = relay.sub([
//                     {
//                         authors: [pubkey],
//                         kinds: [0],
//                     },
//                 ]);

//                 lol.on("event", (event) => {
//                     console.log(event)
//                     const newEvent = new Event(event);
//                     newEvent.save();
//                 });
//                 lol.on("eose", () => {
//                     sub.unsub();
//                     resolve();
//                 });
//             } else {
//                 throw new Error("Not connected to a relay");
//             }
//         } catch (e) {
//             reject(e);
//         }
//     });
//     return promise
// };
