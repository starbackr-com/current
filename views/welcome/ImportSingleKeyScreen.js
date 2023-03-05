import { View, Text, Alert } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { decodePubkey } from "../../utils/nostr/keys";
import { loginToWallet } from "../../utils/wallet";
import { getOldKind0 } from "../../utils/nostrV2/getUserData";
import { getPublicKey } from "nostr-tools";
import { useDispatch } from "react-redux";
import { logIn } from "../../features/authSlice";
import { followPubkey } from "../../features/userSlice";
import { saveValue } from "../../utils/secureStore";

const hexRegex = /^[0-9a-f]{64}$/i;

const bech32Regex = /^(nsec)[a-zA-HJ-NP-Z0-9]+$/i;

const ImportSingleKeyScreen = ({ navigation }) => {
    const [key, setKey] = useState("");
    const [error, setError] = useState(false);
    const dispatch = useDispatch();

    const submitHandler = async () => {
        let privKey;
        let access_token;
        if (!key.match(hexRegex) && !key.match(bech32Regex)) {
            setError(true);
            return;
        }
        if (key.match(hexRegex)) {
            privKey = key;
        }
        if (key.match(bech32Regex)) {
            privKey = await decodePubkey(key);
        }
        try {
            const result = await loginToWallet(privKey);
            const pk = getPublicKey(privKey);
            if (result?.data?.access_token) {
                await saveValue("privKey", privKey);
                access_token = result.data.access_token;
                dispatch(followPubkey(pk));
                dispatch(logIn({ bearer: access_token, pubKey: pk }));
                return;
            } else {
                const data = await getOldKind0(pk);
                const events = [];
                let mostRecent;
                data.map((item) => item.map((event) => events.push(event)));

                mostRecent = events.reduce(
                    (p, c) => {
                        let r = c.created_at > p.created_at ? c : p;
                        return r;
                    },
                    { created_at: 0 }
                );

                let deletedAccount = false;

                try {
                    console.log("mostrecent", mostRecent.content);
                    const mostrecentcontent = JSON.parse(mostRecent.content);
                    deletedAccount = mostrecentcontent.deleted;
                    console.log("deletedaccount", deletedAccount);
                } catch (e) {
                    //ignore
                    console.log(e);
                }

                if (deletedAccount) {
                    Alert.alert(
                        "Deleted Account?",
                        "You cannot use deleted account. Please use a different key.",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    return;
                                },
                            },
                        ]
                    );
                } else {
                    navigation.navigate("UsernameScreen", {
                        privKey,
                        publishProfile: false,
                        isImport: true,
                        updateData: "none",
                    });
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const changeHandler = (e) => {
        setError(false);
        setKey(e);
    };
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textBody}>Import a key</Text>
            <View style={{ width: "80%", flex: 2 }}>
                <Input
                    label="Private Key"
                    textInputConfig={{
                        placeholder: "nsec1...",
                        onChangeText: changeHandler,
                    }}
                />
                {error ? (
                    <Text style={[globalStyles.textBodyS, { color: "red" }]}>
                        Invalid private key! Only HEX (f57d...) or bech32
                        (nsec1...) keys are supported
                    </Text>
                ) : undefined}
            </View>
            <View style={{ flex: 1 }}>
                <CustomButton
                    buttonConfig={{ onPress: submitHandler }}
                    text="Import"
                    containerStyles={{ marginBottom: 16 }}
                />
                <CustomButton
                    buttonConfig={{
                        onPress: () => {
                            navigation.goBack();
                        },
                    }}
                    text="Go Back"
                    secondary
                    containerStyles={{ marginBottom: 16 }}
                />
            </View>
        </View>
    );
};

export default ImportSingleKeyScreen;
