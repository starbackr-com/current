import { useSelector } from "react-redux";
import { usePostPaymentMutation } from "../../../services/walletApi";
import { decodeLnurl } from "../../../utils/bitcoin/lnurl";
import { createZapEvent } from "../../../utils/nostrV2";

export const useZapPlebhy = () => {
    const zapAmount = useSelector((state) => state.user.zapAmount);
    const [sendPayment] = usePostPaymentMutation();

    const zapPlebhy = async (eventId, user, pubkey) => {
        try {
            const dest = user.lud16 ? user.lud16 : user.lud06
            if (!dest) {
                throw new Error('No Lightning Address / LNURL found')
            }
            const url = dest.includes("@")
                ? `https://${dest.split("@")[1]}/.well-known/lnurlp/${
                      dest.split("@")[0]
                  }`
                : decodeLnurl(dest);
            const response = await fetch(url);
            const { callback, minSendable, allowsNostr, nostrPubkey } =
                await response.json();
            let amount;
            if (zapAmount) {
                amount =
                    minSendable / 1000 > zapAmount
                        ? minSendable / 1000
                        : zapAmount;
            } else {
                amount = minSendable / 1000 > 21 ? minSendable / 1000 : 21;
            }
            if (allowsNostr && nostrPubkey) {
                let tags = [];
                tags.push(["p", pubkey]);
                tags.push(["e", eventId]);
                // tags.push(["amount", amount * 1000]);

                const zapevent = await createZapEvent("", tags);
                const callbackResponse = await fetch(
                    `${callback}?amount=${amount * 1000}&nostr=${JSON.stringify(
                        zapevent
                    )}`
                );
                const data = await callbackResponse.json();
                const invoice = data.pr;
                const result = await sendPayment({
                    amount,
                    invoice,
                });
                if (result.data && !result.data.error) {
                    console.log('Success!!')
                }
            } else {
                alert(`Oops..! ${user.name}'s wallet does not support Zaps!`);
                return;
            }
        } catch (e) {
            console.log(e);
        }
    };
    return zapPlebhy;
};
