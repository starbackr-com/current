import { View, Text } from "react-native";
import React, { useState } from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import CustomButton from "../../components/CustomButton";
import { Event, publishEvent } from "../../utils/nostrV2";
import { ScrollView } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import BackButton from "../../components/BackButton";
import * as Linking from "expo-linking";
import { useSelector } from "react-redux";
import { twitterRegex } from "../../constants";
import { encodePubkey } from "../../utils/nostr/keys";

const VerifyTwitterModal = ({ navigation }) => {
    const [handle, setHandle] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const pk = useSelector((state) => state.auth.pubKey);

    const submitHandler = async () => {
        if (!handle.match(twitterRegex)) {
            setError("This is not a valid twitter handle!");
            return;
        }
        setIsLoading(true);
        setError(false);
        try {
            const npub = encodePubkey(pk);
            let content = `#[0] Verifying My Public Key: "${handle}"`;
            let tweetIntent = `https://twitter.com/intent/tweet?text=Verifying%20my%20account%20on%20nostr%20using%20%40getcurrent_io%0A%0AMy%20Public%20Key%3A%20%22${npub}%22%0A%0AFind%20others%20at%20https%3A%2F%2Fnostr.directory%20%40nostrdirectory%20%23nostr`;
            const { successes, event } = await publishEvent(content, [
                [
                    "p",
                    "5e7ae588d7d11eac4c25906e6da807e68c6498f49a38e4692be5a089616ceb18",
                ],
            ]);
            if (successes > 1) {
                setError("There was an issue publishing the note...");
                throw new Error("Could not publish note...");
            }
            const newEvent = new Event(event);
            newEvent.save();
            Linking.openURL(tweetIntent);
            navigation.goBack();
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const changeHandler = (e) => {
        setHandle(e);
        setError(null);
    };
    return (
        <ScrollView
            style={[globalStyles.screenContainerScroll]}
            contentContainerStyle={{ alignItems: "center" }}
        >
            <View style={{ width: "100%", alignItems: "flex-start" }}>
                <BackButton
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
            </View>
            <View style={{ width: "75%", marginBottom: 32 }}>
                <Input
                    textInputConfig={{
                        onChangeText: changeHandler,
                        autoCapitalize: "none",
                        autoCorrect: false,
                    }}
                    label="Your Twitter Handle:"
                />
            </View>
            <View style={{ marginBottom: 32 }}>
                <Text style={globalStyles.textBodyBold}>Nostr Message:</Text>
                <Text
                    style={[
                        globalStyles.textBodyS,
                        { color: colors.primary500 },
                    ]}
                >
                    @nostrdirectory Verifying My Public Key: "{handle}"
                </Text>
            </View>
            {error ? (
                <Text style={globalStyles.textBodyError}>{error}</Text>
            ) : undefined}
            <CustomButton
                text="Publish and verify on Twitter"
                buttonConfig={{ onPress: submitHandler }}
                loading={isLoading}
            />
        </ScrollView>
    );
};

export default VerifyTwitterModal;
