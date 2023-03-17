import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { usePostPaymentMutation } from "../services/walletApi";
import { decodeLnurl } from "../utils/bitcoin/lnurl";
import { createZapEvent } from "../utils/nostrV2";

export const useZapNote = (eventId, dest, name) => {
    const zapAmount = useSelector((state) => state.user.zapAmount);
    const zapComment = useSelector((state) => state.user.zapComment);
    const zapNoconf = useSelector((state) => state.user.zapNoconf);
    const navigation = useNavigation();
    const [sendPayment] = usePostPaymentMutation();

    const zap = async () => {
        if (!zapAmount) {
            Alert.alert(
                "No Zap-Amount set!",
                `In order to Zap a post you will need to set a default Zap-Amount first`,
                [
                    {
                        text: "Settings",
                        onPress: () => {
                            navigation.navigate("Settings", {
                                screen: "Payments",
                            });
                        },
                    },
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                ]
            );
            return;
        }
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
                minSendable / 1000 > zapAmount ? minSendable / 1000 : zapAmount;

            console.log(zapNoconf);

            if (zapNoconf && (minSendable / 1000 < zapAmount)) {

              let response;
              if (allowsNostr && nostrPubkey) {
                  let tags = [];
                  tags.push(["p", nostrPubkey]);
                  tags.push(["e", eventId]);
                  // tags.push(["amount", amount * 1000]);

                  const zapevent = await createZapEvent(zapComment?zapComment:'', tags);
                  const stringifiedEvent = JSON.stringify(zapevent)
                  console.log(stringifiedEvent)
                  response = await fetch(
                      `${callback}?amount=${
                          amount * 1000
                      }&nostr=${JSON.stringify(zapevent)}`
                  );
              } else {
                  alert(
                      `Oops..! ${name}'s wallet does not support Zaps!`
                  );
                  return;
              }
              const data = await response.json();
              console.log(data)
              const invoice = data.pr;
              const result = await sendPayment({
                  amount,
                  invoice,
              });
              if (result.data && !result.data.error) {
                  alert(
                      `⚡ 🎉 Zap success: ${amount} SATS to ${
                          name
                      } `
                  );
              } else {
                  alert(
                      `Oops..! ${name}'s wallet does not support Zaps!`
                  );
                  return;
              }
              return;


            } else {
              Alert.alert(
                  "Zap",
                  `Do you want to send ${zapAmount} SATS to ${name}?`,
                  [
                      {
                          text: "Yes!",
                          onPress: async () => {
                              let response;
                              if (allowsNostr && nostrPubkey) {
                                  let tags = [];
                                  tags.push(["p", nostrPubkey]);
                                  tags.push(["e", eventId]);
                                  // tags.push(["amount", amount * 1000]);

                                  const zapevent = await createZapEvent(zapComment?zapComment:'', tags);
                                  const stringifiedEvent = JSON.stringify(zapevent)
                                  console.log(stringifiedEvent)
                                  response = await fetch(
                                      `${callback}?amount=${
                                          amount * 1000
                                      }&nostr=${JSON.stringify(zapevent)}`
                                  );
                              } else {
                                  alert(
                                      `Oops..! ${name}'s wallet does not support Zaps!`
                                  );
                                  return;
                              }
                              const data = await response.json();
                              console.log(data)
                              const invoice = data.pr;
                              const result = await sendPayment({
                                  amount,
                                  invoice,
                              });
                              if (result.data && !result.data.error) {
                                  alert(
                                      `⚡ 🎉 Zap success: ${amount} SATS to ${
                                          name
                                      } `
                                  );
                              } else {
                                  alert(
                                      `Oops..! ${name}'s wallet does not support Zaps!`
                                  );
                                  return;
                              }
                              return;
                          },
                      },
                      {
                          text: "Cancel",
                          style: "cancel",
                      },
                  ]
              );

            }


        } catch (e) {
            console.log(e);
        }
    };
    return zap;
};
