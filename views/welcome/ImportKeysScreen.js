import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useRef, useState } from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import CustomButton from "../../components/CustomButton";
import wordlist from "../../utils/wordlist.json";
import { mnemonicToSeed } from "../../utils/keys";

const ImportKeysScreen = () => {
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

    const onChangeHandler = (index, value) => {
        setWords({ ...words, [index]: value.toLowerCase() });
    };

    const submitHandler = async () => {
        const errorArray = []
        const mem = []
        for (const [key, value] of Object.entries(words)) {
            if (!wordlist.includes(value)) {
                errorArray.push(key)
                continue
            }
            mem.push(value)
        }
        setError(errorArray)
        if (errorArray.length === 0 && mem.length === 12) {
            const privKey = await mnemonicToSeed(mem)
            console.log(privKey)
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
                        inputStyle={[{ width: "40%" }, error.includes('1') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "1",
                            ref: input1,
                            // onBlur: () => {
                            //     input2.current.focus();
                            // },
                            onChangeText: (text) => {
                                onChangeHandler("1", text);
                            },
                            autoCapitalize: 'none'
                        }}
                    />
                    <Input
                        inputStyle={[{ width: "40%" }, error.includes('2') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "2",
                            ref: input2,
                            // onBlur: () => {
                            //     input3.current.focus();
                            // },
                            onChangeText: (text) => {
                                onChangeHandler("2", text);
                            },
                            autoCapitalize: 'none'
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
                        inputStyle={[{ width: "40%" }, error.includes('3') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "3",
                            ref: input3,
                            // onBlur: () => {
                            //     input4.current.focus();
                            // },
                            onChangeText: (text) => {
                                onChangeHandler("3", text);
                            },
                            autoCapitalize: 'none'
                        }}
                    />
                    <Input
                        inputStyle={[{ width: "40%" }, error.includes('4') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "4",
                            ref: input4,
                            // onBlur: () => {
                            //     input5.current.focus();
                            // },
                            onChangeText: (text) => {
                                onChangeHandler("4", text);
                            },
                            autoCapitalize: 'none'
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
                        inputStyle={[{ width: "40%" }, error.includes('5') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "5",
                            ref: input5,
                            onSubmitEditing: () => {
                                input6.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("5", text);
                            },
                            autoCapitalize: 'none'
                        }}
                    />
                    <Input
                        inputStyle={[{ width: "40%" }, error.includes('6') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "6",
                            ref: input6,
                            onSubmitEditing: () => {
                                input7.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("6", text);
                            },
                            autoCapitalize: 'none'
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
                        inputStyle={[{ width: "40%" }, error.includes('7') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "7",
                            ref: input7,
                            onSubmitEditing: () => {
                                input8.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("7", text);
                            },
                            autoCapitalize: 'none'
                        }}
                    />
                    <Input
                        inputStyle={[{ width: "40%" }, error.includes('8') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "8",
                            ref: input8,
                            onSubmitEditing: () => {
                                input9.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("8", text);
                            },
                            autoCapitalize: 'none'
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
                        inputStyle={[{ width: "40%" }, error.includes('9') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "9",
                            ref: input9,
                            onSubmitEditing: () => {
                                input10.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("9", text);
                            },
                            autoCapitalize: 'none'
                        }}
                    />
                    <Input
                        inputStyle={[{ width: "40%" }, error.includes('10') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "10",
                            ref: input10,
                            onSubmitEditing: () => {
                                input11.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("10", text);
                            },
                            autoCapitalize: 'none'
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
                        inputStyle={[{ width: "40%" }, error.includes('11') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "11",
                            ref: input11,
                            onSubmitEditing: () => {
                                input12.current.focus();
                            },
                            onChangeText: (text) => {
                                onChangeHandler("11", text);
                            },
                            autoCapitalize: 'none'
                        }}
                    />
                    <Input
                        inputStyle={[{ width: "40%" }, error.includes('12') ? {borderColor: 'red'} : undefined]}
                        textInputConfig={{
                            placeholder: "12",
                            ref: input12,
                            onChangeText: (text) => {
                                onChangeHandler("12", text);
                            },
                            autoCapitalize: 'none'
                        }}
                    />
                </View>
                <CustomButton
                    text="Import keys"
                    buttonConfig={{ onPress: submitHandler }}
                    containerStyles={{justifyContent: 'center'}}
                />
            </ScrollView>
        </View>
    );
};

export default ImportKeysScreen;
