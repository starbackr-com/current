import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import React, { useRef } from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/CustomButton";
import { useEffect } from "react";
import { useState } from "react";
import { setZapAmount } from "../../features/userSlice";
import { storeData } from "../../utils/cache/asyncStorage";
import { useHeaderHeight } from "@react-navigation/elements";


const SettingsPaymentsScreen = ({ navigation }) => {
    const { zapAmount } = useSelector((state) => state.user);
    const [zapValueInput, setZapValueInput] = useState();
    const dispatch = useDispatch();

    const headerHeight = useHeaderHeight();

    const zapAmountInput = useRef();

    useEffect(() => {
        setZapValueInput(zapAmount);
    }, [zapAmount]);

    const submitHandler = async () => {
        try {
            await storeData("zapAmount", zapValueInput);
            dispatch(setZapAmount(zapValueInput));
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
                        ref: zapAmountInput
                    }}
                    label="Default Zap Value"
                />
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
