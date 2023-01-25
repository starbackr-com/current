import { View, Text, FlatList, Button } from "react-native";
import React, { useState } from "react";
import globalStyles from "../../styles/globalStyles";
import { mnemonicToSeed } from "../../utils/keys";
import * as nostr from "nostr-tools";
import { usePostNewWalletMutation } from "../../services/walletApi";
import { saveValue } from "../../utils/secureStore";
import { useDispatch } from "react-redux";
import { logIn } from "../../features/authSlice";
import CustomButton from "../../components/CustomButton";
import { createWallet, loginToWallet } from "../../utils/wallet";
import { postEvent } from "../../utils/nostr";
import { setNip05 } from "../../utils/nostr/nip05";

const Word = ({ word, index }) => {
    return (
        <View
            style={[
                {
                    padding: 12,
                    backgroundColor: "#222222",
                    borderRadius: 5,
                    width: "45%",
                    margin: 6,
                    textAlign: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                },
            ]}
        >
            <Text style={globalStyles.textBody}>{index + 1}</Text>
            <Text style={globalStyles.textBody}>{word}</Text>
        </View>
    );
};

const ShowBackupScreen = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { mem } = route.params;
    const [postWallet, results] = usePostNewWalletMutation();
    const [isLoading, setIsLoading] = useState(false);

    const nextHandler = async () => {
        setIsLoading(true);
        try{
            const privKey = await mnemonicToSeed(mem);
        await saveValue("mem", JSON.stringify(mem));
        navigation.navigate("UsernameScreen", { privKey });
        setIsLoading(false)
        } catch(e) {
            console.log(e)
            setIsLoading(false)
        }
    };
    return (
        <View style={globalStyles.screenContainer}>
            <View style={{ flex: 4, alignItems: 'center' }}>
                <Text style={globalStyles.textBodyBold}>Backup</Text>
                <Text style={[globalStyles.textBody, {marginBottom: 16}]}>
                    These 12 words can be used to restore your access to your
                    account. Make sure to write them down. You can display your
                    backup at any time in the settings.
                </Text>
                <FlatList
                    data={mem}
                    renderItem={({ item, index }) => (
                        <Word word={item} index={index} />
                    )}
                    style={{ width: "100%", flexGrow: 0 }}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    numColumns={2}
                />
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
                <CustomButton
                    text="Next"
                    buttonConfig={{ onPress: nextHandler }}
                    loading={isLoading}
                />
            </View>
        </View>
    );
};

export default ShowBackupScreen;
