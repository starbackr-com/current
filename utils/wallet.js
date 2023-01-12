import { getValue } from "./secureStore"
import {sha256} from '@noble/hashes/sha256'
import * as secp256k1 from '@noble/secp256k1'
import { getPublicKey } from "nostr-tools"
import { store } from "../store/store"
import { walletApi } from "../services/walletApi"


const utf8Encoder = new TextEncoder()


export const createWallet = () => {}

export const loginToWallet = async () => {
    try {
        const privKey = await getValue('privKey')
        if (!privKey) {
            throw new Error('No privKey found in storage!')
        }
        const password = secp256k1.utils.bytesToHex(sha256(utf8Encoder.encode(privKey)))
        const username = getPublicKey(privKey)
        const result = await store.dispatch(walletApi.endpoints.postLogin.initiate({login: username, password: password})).unwrap()
        if (result?.error === true) {
            throw new Error(`Auth failed: ${result?.message}`)
        }
    } catch (err) {
        console.log(err)
    }

}