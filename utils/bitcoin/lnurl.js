import { bech32 } from "bech32";

const utf8Encoder = new TextDecoder();

export const decodeLnurl = (lnurl) => {
    try {
        let { prefix: hrp, words: dataPart } = bech32.decode(lnurl, 2000);
        let requestByteArray = bech32.fromWords(dataPart);
        let decoded = utf8Encoder.decode(new Uint8Array(requestByteArray));
        return decoded;
    } catch (err) {
        console.log("Something went wrong while decoding LNURL...");
    }
};
