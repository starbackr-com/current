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
            if (result.data.access_token) {
                access_token = result.data.access_token;
                dispatch(followPubkey(pk));
                dispatch(logIn({ bearer: access_token, pubKey: pk }));
            }
        } catch (err) {
            console.log(privKey);
            const pk = getPublicKey(privKey);
            const data = await getOldKind0(pk);
            const events = [];
            data.map((item) => item.map((event) => events.push(event)));
            if (events.length >= 1) {
                const mostRecent = events.reduce(
                    (p, c) => {
                        let r = c.created_at > p.created_at ? c : p;
                        return r;
                    },
                    { created_at: 0 }
                );
                Alert.alert(
                    "Update Profile?",
                    `A profile for this key already exists. Do you want to update it or keep the old one? (If you do not update the Lightning Address, Tips you receive will not show up in your current wallet!)`,
                    [
                        {
                            text: "Keep old data",
                            onPress: () => {
                                navigation.navigate("UsernameScreen", {
                                    privKey,
                                    publishProfile: false,
                                    isImport: true,
                                });
                            },
                        },
                        {
                            text: "Update Lightning Address",
                            onPress: () => {},
                        },
                        {
                            text: "Update everything",
                            onPress: () => {},
                        },
                    ]
                );
            }
            Alert.alert(
                "Update Profile?",
                `We couldn't find any profile data on the connected relays... Do you want to update it? (If you do not update the Lightning Address, Tips you receive will not show up in your current wallet!)`,
                [
                    {
                        text: "Update Profile Data",
                        onPress: () => {
                            navigation.navigate("UsernameScreen", {
                                privKey,
                                publishProfile: true,
                                isImport: true,
                            });
                        },
                    },
                    {
                        text: "Do not update!",
                        onPress: () => {
                            navigation.navigate("UsernameScreen", {
                                privKey,
                                publishProfile: false,
                                isImport: true,
                            });
                        },
                    }
                ]
            );
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
