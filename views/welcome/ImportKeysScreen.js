import { Text, View, ScrollView, Alert } from "react-native";
import React, { useRef, useState } from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import CustomButton from "../../components/CustomButton";
import wordlist from "../../utils/wordlist.json";
import { mnemonicToSeed } from "../../utils/keys";
import { getPublicKey } from "nostr-tools";
import { loginToWallet } from "../../utils/wallet";
import { saveValue } from "../../utils/secureStore";
import { useDispatch } from "react-redux";
import { logIn } from "../../features/authSlice";
import { getOldKind0 } from "../../utils/nostrV2/getUserData";
import { followPubkey } from "../../features/userSlice";
import { initRC } from "../../features/premium";

const ImportKeysScreen = ({ navigation }) => {
    const input1 = useRef();
    const input2 = useRef();
    const input3 = useRef();
    const input4 = useRef();
    const input5 = useRef();
    const input6 = useRef();
    const input7 = useRef();
    const input8 = useRef();
    const input9 = useRef();
    const input10 = useRef();
    const input11 = useRef();
    const input12 = useRef();
    const [words, setWords] = useState({});
    const [error, setError] = useState([]);

    const dispatch = useDispatch();

    const onChangeHandler = (index, value) => {
        setWords({ ...words, [index]: value.toLowerCase() });
    };

    const submitHandler = async () => {
        const errorArray = [];
        const mem = [];
        for (const [key, value] of Object.entries(words)) {
            if (!wordlist.includes(value)) {
                errorArray.push(key);
                continue;
            }
            mem.push(value);
        }
        setError(errorArray);
        if (errorArray.length === 0 && mem.length === 12) {
            try {
                const privKey = await mnemonicToSeed(mem);
                const pubKey = getPublicKey(privKey);
                const result = await loginToWallet(privKey);
                await initRC(pubKey);
                const access_token = result?.data?.access_token;
                const username = result?.data?.username;
                if (access_token) {
                    await saveValue("privKey", privKey);
                    await saveValue("mem", JSON.stringify(mem));
                    dispatch(followPubkey(pubKey));
                    dispatch(logIn({ bearer: access_token, username, pubKey }));
                    return;
                } else {
                    const data = await getOldKind0(pubKey);
                    const events = [];
                    let mostRecent
                    data.map((item) => item.map((event) => events.push(event)));

                        mostRecent = events.reduce(
                            (p, c) => {
                                let r = c.created_at > p.created_at ? c : p;
                                return r;
                            },
                            { created_at: 0 }
                        );
                        let deletedAccount=false;

                        try {
                          console.log('mostrecent', mostRecent.content);
                          const mostrecentcontent = JSON.parse(mostRecent.content);
                          deletedAccount = mostrecentcontent.deleted;
                          console.log('deletedaccount', deletedAccount);

                        } catch (e) {
                            //ignore
                            console.log(e);
                        }


                        if (deletedAccount) {
                          Alert.alert(
                                  "Deleted Account?",
                                   "You cannot use deleted account. Please use a different key.",
                                   [{text: 'OK', onPress: () => {return;}}]

                          );
                        }
                    if (events.length >= 1 && !deletedAccount) {
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
                    } else if (!deletedAccount) {
                        Alert.alert(
                            "Create Profile?",
                            `We couldn't find a profile for this key on the connected relays... Do you want to create one? (If you don't, you will not be able to receive zaps on those relays.)`,
                            [
                                {
                                    text: "Create Profile",
                                    onPress: () => {
                                        navigation.navigate("UsernameScreen", {
                                            privKey,
                                            publishProfile: true,
                                            isImport: true,
                                            updateData: 'all'
                                        });
                                    },
                                },
                                {
                                    text: "Update Tip Address only",
                                    onPress: () => {
                                        navigation.navigate("UsernameScreen", {
                                            privKey,
                                            publishProfile: true,
                                            isImport: true,
                                            updateData: 'ln',
                                            oldData: mostRecent
                                        });
                                    },
                                },
                                {
                                    text: "Continue without",
                                    onPress: () => {
                                        navigation.navigate("UsernameScreen", {
                                            privKey,
                                            publishProfile: false,
                                            isImport: true,
                                            updateData: 'none'
                                        });
                                    },
                                },
                            ]
                        );
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    };
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Import your keys</Text>
            <ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 16,
                    }}
                >
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("1")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "1",
                            ref: input1,
                            onSubmitEditing: () => {
                                input2.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("1", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("2")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "2",
                            ref: input2,
                            onSubmitEditing: () => {
                                input3.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("2", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 16,
                    }}
                >
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("3")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "3",
                            ref: input3,
                            onSubmitEditing: () => {
                                input4.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("3", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("4")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "4",
                            ref: input4,
                            onSubmitEditing: () => {
                                input5.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("4", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 16,
                    }}
                >
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("5")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "5",
                            ref: input5,
                            onSubmitEditing: () => {
                                input6.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("5", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("6")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "6",
                            ref: input6,
                            onSubmitEditing: () => {
                                input7.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("6", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 16,
                    }}
                >
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("7")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "7",
                            ref: input7,
                            onSubmitEditing: () => {
                                input8.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("7", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("8")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "8",
                            ref: input8,
                            onSubmitEditing: () => {
                                input9.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("8", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 16,
                    }}
                >
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("9")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "9",
                            ref: input9,
                            onSubmitEditing: () => {
                                input10.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("9", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("10")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "10",
                            ref: input10,
                            onSubmitEditing: () => {
                                input11.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("10", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 48,
                    }}
                >
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("11")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "11",
                            ref: input11,
                            onSubmitEditing: () => {
                                input12.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("11", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                    <Input
                        inputStyle={[
                            { width: "40%" },
                            error.includes("12")
                                ? { borderColor: "red" }
                                : undefined,
                        ]}
                        textInputConfig={{
                            placeholder: "12",
                            ref: input12,
                            onChangeText: (text) => {
                                onChangeHandler("12", text);
                            },
                            autoCapitalize: "none",
                        }}
                    />
                </View>
                <CustomButton
                    text="Restore from Backup"
                    buttonConfig={{ onPress: submitHandler }}
                    containerStyles={{
                        justifyContent: "center",
                        marginBottom: 16,
                    }}
                />
                <CustomButton
                    text="Import nsec / key instead"
                    buttonConfig={{
                        onPress: () => {
                            navigation.navigate("ImportSingleKeyScreen");
                        },
                    }}
                    containerStyles={{
                        justifyContent: "center",
                        marginBottom: 16,
                    }}
                    secondary
                />
                <CustomButton
                    text="Go Back"
                    buttonConfig={{
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Welcome' }],
                              });
                        },
                    }}
                    containerStyles={{ justifyContent: "center" }}
                    secondary
                />
            </ScrollView>
        </View>
    );
};

export default ImportKeysScreen;
