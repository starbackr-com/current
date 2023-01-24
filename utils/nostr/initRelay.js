import {
    relayInit
} from "nostr-tools";

const relay = relayInit("wss://nostr-pub.wellorder.net");
relay.connect()

relay.on("error", () => {
    console.log(`failed to connect to ${relay.url}`);
});


export default relay