import {
    relayInit
} from "nostr-tools";

const relay = relayInit("wss://nostr-pub.wellorder.net");
relay.connect()


export default relay