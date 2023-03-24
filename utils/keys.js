import { privateKeyFromSeedWords } from "nostr-tools/lib/nip06";
import wordlist from "./wordlist.json";
export const generateMnemonic = async () => {
    const ent = window.crypto.getRandomValues(new Uint8Array(16));
    const entBits = Array.from(bitsFromOctets(ent));
    const entHash = new Uint8Array(
        await window.crypto.subtle.digest("SHA-256", ent)
    );
    const checksum = Array.from(bitsFromOctets(entHash)).slice(0, 4);
    const entCS = entBits.concat(checksum);
    const chunks = Array.from(hendecadsFromBits(entCS));
    const words = [];
    for (let i = 0; i < chunks.length; i++) {
        words.push(wordlist[chunks[i]]);
    }
    return words;
};

export const mnemonicToSeed = async (words) => {
    const privKey = await privateKeyFromSeedWords(words.join(' '))
    return privKey
}

function* bitsFromOctets(octets) {
    for (let byte of octets) {
        for (let i = 0; i < 8; i++) {
            yield byte & 1;
            byte >>= 1;
        }
    }
}
function* hendecadsFromBits(bits) {
    let i = 0;
    let val = 0;
    for (const bit of bits) {
        if (i == 11) {
            yield val;
            i = val = 0;
        }
        val |= bit << i++;
    }
    if (i > 0) yield val;
}
