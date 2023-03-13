import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { decodePubkey } from "../utils/nostr/keys";

export const useLinking = () => {
    const url = Linking.useURL();
    const navigation = useNavigation();
    if (url) {
        const { scheme, path } = Linking.parse(url);
        if (scheme === "nostr" && path.startsWith("npub")) {
            const pk = decodePubkey(path);
            navigation.navigate("Profile", {
                screen: "ProfileScreen",
                params: {
                    pubkey: pk,
                    name: pk.slice(0, 16),
                },
            });
        }
    }
};
