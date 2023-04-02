import { View, Text } from "react-native";
import React, { useState } from "react";
import globalStyles from "../../../styles/globalStyles";
import { IntroductionItem } from "../components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton";
import { ScrollView } from "react-native-gesture-handler";
import { generateRandomString } from "../../../utils/cache/asyncStorage";
import { generateSeedphrase, mnemonicToSeed } from "../../../utils/keys";

const IntroductionView = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const createHandler = () => {
        setIsLoading(true);
        generateRandomString(12);
        const mem = generateSeedphrase();
        const sk = mnemonicToSeed(mem);
        navigation.navigate("EULA", { mem, sk });
        setIsLoading(false);
    };
    return (
        <View
            style={[
                globalStyles.screenContainer,
                { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}
        >
            <ScrollView
                style={{ marginTop: 32, width: "100%" }}
                horizontal={false}
            >
                <View style={{width: '100%', justifyContent: 'center'}}>
                    <Text
                        style={[globalStyles.textH2, { textAlign: "center" }]}
                    >
                        The power of nostr + bitcoin at your hands!
                    </Text>
                </View>
                <IntroductionItem
                    title="Runs on nostr"
                    text="Current is your gateway to the decentralised social network 'nostr'"
                    icon="globe"
                />
                <IntroductionItem
                    title="You are in control"
                    text="Everything inside Current is controlled by cryptographic keys that only you have access to."
                    icon="lock-closed"
                />
                <IntroductionItem
                    title="Powered by Lightning"
                    text="Zap away with an integrated Bitcoin Lightning Wallet"
                    icon="flash"
                />
                <IntroductionItem
                    title="Usernames"
                    text="Current comes with a single username for you nostr and Lightning address"
                    icon="person-circle-outline"
                />
            </ScrollView>
            <CustomButton
                text="Let's go!"
                loading={isLoading}
                buttonConfig={{ onPress: createHandler }}
            />
        </View>
    );
};

export default IntroductionView;
