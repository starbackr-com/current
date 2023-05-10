import { generatePrivateKey, getPublicKey } from 'nostr-tools';

function genWalletConnectKey() {
  const privKey = generatePrivateKey();
  const pubKey = getPublicKey(privKey);
  return { privKey, pubKey };
}

export default genWalletConnectKey;
