import { usePostPaymentMutation } from "../../../services/walletApi";
import { decodeLnurl } from "../../../utils/bitcoin/lnurl";

export const getZapInvoice = async (amount, dest, user) => {
    try {
        const url = dest.includes("@")
            ? `https://${dest.split("@")[1]}/.well-known/lnurlp/${
                  dest.split("@")[0]
              }`
            : decodeLnurl(dest);
        const response = await fetch(url);
        const { callback, minSendable, allowsNostr, nostrPubkey } =
            await response.json();

        const amount =
            minSendable / 1000 > amount ? minSendable / 1000 : amount;

        Alert.alert("Zap", `Do you want to send ${amount} SATS to ${user}?`, [
            {
                text: "Yes!",
                onPress: async () => {
                    let response;
                    if (allowsNostr && nostrPubkey) {
                        let tags = [];
                        tags.push(["p", nostrPubkey]);
                        tags.push(["e", item.id]);
                        // tags.push(["amount", amount * 1000]);

                        const zapevent = await createZapEvent("", tags);

                        console.log(zapevent);

                        response = await fetch(
                            `${callback}?amount=${
                                amount * 1000
                            }&nostr=${JSON.stringify(zapevent)}`
                        );
                    } else {
                        response = await fetch(
                            `${callback}?amount=${amount * 1000}`
                        );
                    }
                    const data = await response.json();
                    const invoice = data.pr;
                    const result = await sendPayment({
                        amount,
                        invoice,
                    });
                    if (!result.data.error) {
                        //zapSuccess();
                        alert(`🤑 🎉 Zap success: ${amount} SATS to ${user} `);
                    } else {
                        alert("Zap Failed");
                    }
                    return;
                },
            },
            {
                text: "Cancel",
                style: "cancel",
            },
        ]);
    } catch (e) {
        console.log(e);
    }
};
