import { View, Text, FlatList, Button } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import { mnemonicToSeed } from "../../utils/keys";
import * as nostr from "nostr-tools";
import { usePostNewWalletMutation } from "../../services/walletApi";
import { saveValue } from "../../utils/secureStore";
import { useDispatch } from "react-redux";
import { logIn } from "../../features/authSlice";

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

const ShowBackupScreen = ({ route }) => {
    const dispatch = useDispatch();
    const mem = route.params.mem;
    const [postWallet, results] = usePostNewWalletMutation();

    const saveHandler = async () => {
        const privKey = await mnemonicToSeed(mem);
        const pubKey = nostr.getPublicKey(privKey);

        const response = await postWallet({
            login: pubKey,
            password: "12345",
        }).unwrap();
        await saveValue("privKey", privKey);
        dispatch(logIn({ privKey, pubKey }));
    };
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>
                This is your Backup... Write it down!
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
            <Button title="I have written it down!" onPress={saveHandler} />
        </View>
    );
};

export default ShowBackupScreen;
