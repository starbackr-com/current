import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import React, { useRef } from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/CustomButton";
import { useEffect } from "react";
import { useState } from "react";
import { setZapAmount } from "../../features/userSlice";
import { setZapComment } from "../../features/userSlice";
import { setZapNoconf } from "../../features/userSlice";
import { storeData } from "../../utils/cache/asyncStorage";
import { useHeaderHeight } from "@react-navigation/elements";
import Checkbox from 'expo-checkbox';


const SettingsPaymentsScreen = ({ navigation }) => {
    const { zapAmount, zapComment, zapNoconf } = useSelector((state) => state.user);
    const [zapValueInput, setZapValueInput] = useState();
    const [zapValueComment, setZapValueComment] = useState();
    const [iszapNoconfChecked, setzapNoconfChecked] = useState(false);
    const username = useSelector((state) => state.auth.username);
    const dispatch = useDispatch();

    const headerHeight = useHeaderHeight();

    const zapAmountInput = useRef();
    const zapCommentInput = useRef();
    const zapNoconfInput = useRef();

    useEffect(() => {
        setZapValueInput(zapAmount);
        setZapValueComment(zapComment);
        setzapNoconfChecked(zapNoconf)
    }, [zapAmount],[zapComment], [zapNoconf]);

    const submitHandler = async () => {
        try {
            await storeData("zapAmount", zapValueInput);
            let zapComment = zapValueComment;
            if (zapValueComment === '') zapComment = '⚡️ by ' + username;
            await storeData("zapComment", zapComment );
            await storeData("zapNoconf", iszapNoconfChecked.toString() );
            dispatch(setZapAmount(zapValueInput));
            dispatch(setZapComment(zapComment));
            dispatch(setZapNoconf(iszapNoconfChecked));
            zapAmountInput.current.blur();
            navigation.goBack();
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <KeyboardAvoidingView style={[globalStyles.screenContainer]} keyboardVerticalOffset={headerHeight} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Text style={globalStyles.textH2}>Payment Settings</Text>
            <View style={{ flex: 2, width: '80%'}}>
                <Input
                    textInputConfig={{
                        value: zapValueInput,
                        onChangeText: setZapValueInput,
                        inputMode: 'numeric',
                        ref: zapAmountInput,
                        marginTop: 20,
                        marginBottom: 20
                    }}
                    label="Default Zap Value"
                />
                <Input
                    style={{marginTop: 32}}
                    textInputConfig={{
                        placeholder: '⚡️ by ' + username,
                        value: zapValueComment,
                        onChangeText: setZapValueComment,
                        ref: zapCommentInput,
                        marginTop: 20
                    }}
                    label="Zap Comment"
                />
                <View style={globalStyles.screenContainer, { width: '100%', justifyContent: "space-evenly", flexDirection: 'row', marginBottom: 32}}>
                        <Checkbox style={globalStyles.checkbox, {marginTop: 32}} value={iszapNoconfChecked} onValueChange={setzapNoconfChecked} />
                        <Text style={globalStyles.textH2, {color: colors.primary500, marginTop: 32}}>No Zap Confirmation?</Text>
                </View>


            </View>
            <View style={{ width: '100%', justifyContent: "space-evenly", flexDirection: 'row', marginBottom: 32}}>
                <CustomButton
                    text="Save"
                    buttonConfig={{ onPress: submitHandler }}
                />
                <CustomButton
                    text="Back"
                    secondary
                    buttonConfig={{
                        onPress: () => {
                            navigation.navigate('SettingsHomeScreen');
                        },
                    }}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

export default SettingsPaymentsScreen;
