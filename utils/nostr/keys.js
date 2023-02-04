import { bech32 } from "bech32";

const utf8Encoder = new TextDecoder();

function buf2hex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
  }

export const decodePubkey = (pubkey) => {
    try {
        let { prefix: hrp, words: dataPart } = bech32.decode(pubkey, 2000);
        let requestByteArray = bech32.fromWords(dataPart);
        let decoded = buf2hex(requestByteArray)
        return decoded;
    } catch (err) {
        console.log(err);
    }
};