import { View, Text, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "../../styles/globalStyles";
import CustomButton from "../../components/CustomButton";
import { getValue } from "../../utils/secureStore";
import * as Clipboard from "expo-clipboard";
import { encodeSeckey } from "../../utils/nostr/keys";
import Input from "../../components/Input";
import BackButton from "../../components/BackButton";

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

const DisplayKeysScreen = ({ navigation }) => {
    const placeholder = [
        "****",
        "****",
        "****",
        "****",
        "****",
        "****",
        "****",
        "****",
        "****",
        "****",
        "****",
        "****",
    ];

    const keyPlaceholder =
        "nsec1*************************************************";
    const [mem, setMem] = useState();
    const [sk, setSk] = useState();

    const [show, setShow] = useState(false);

    let keys;

    useEffect(() => {
        getKeysFromStore();
    }, []);

    const getKeysFromStore = async () => {
        keys = await getValue("mem");
        if (keys) {
            setMem(JSON.parse(keys));
        } else {
            const sk = await getValue("privKey");
            const nsec = encodeSeckey(sk);
            setSk(nsec);
        }
    };

    showHandler = async () => {
        setShow((prev) => !prev);
    };

    const copyHandler = async () => {
        const sk = await getValue("privKey");
        const nsec = encodeSeckey(sk);
        await Clipboard.setStringAsync(nsec);
        alert('Copied key to clipboard!')
    };

    const copyKeysHandler = async () => {
        const keys = await getValue("mem");
        console.log(keys);
        await Clipboard.setStringAsync(keys);
        alert('Copied key to clipboard!')
    };

    return (
        <View style={globalStyles.screenContainer}>
            <View style={{width: '100%'}}>
                <BackButton onPress={() => {navigation.goBack()}}/>
            </View>
            <View style={{ flex: 3, width: "100%", alignItems: "center" }}>
                {mem ? (
                    <FlatList
                        data={show ? mem : placeholder}
                        renderItem={({ item, index }) => (
                            <Word word={item} index={index} />
                        )}
                        style={{ width: "100%", flexGrow: 0 }}
                        columnWrapperStyle={{ justifyContent: "space-between" }}
                        numColumns={2}
                    />
                ) : undefined}
                {sk ? (
                    <Input
                        textInputConfig={{
                            editable: false,
                            value: show ? sk : keyPlaceholder,
                            multiline: true,
                        }}
                        inputStyle={{ width: "90%" }}
                    />
                ) : undefined}
                {show ? (
                  <CustomButton
                      text='Copy Keys'
                      buttonConfig={{ onPress: copyKeysHandler }}
                      containerStyles={{ marginBottom: 16 }}
                  />
                ) : undefined}
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
                <CustomButton
                    text='Copy nSec'
                    buttonConfig={{ onPress: copyHandler }}
                    containerStyles={{ marginBottom: 16 }}
                />
                <CustomButton
                    text={show ? "Hide Keys" : "Show Keys"}
                    buttonConfig={{ onPress: showHandler }}
                    containerStyles={{ marginBottom: 16 }}
                />
            </View>
        </View>
    );
};

export default DisplayKeysScreen;
