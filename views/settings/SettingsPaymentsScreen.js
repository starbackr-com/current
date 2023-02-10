import { View, Text, KeyboardAvoidingView } from "react-native";
import React from "react";
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

    useEffect(() => {
        setZapValueInput(zapAmount);
    }, [zapAmount]);

    const submitHandler = async () => {
        try {
            await storeData("zapAmount", zapValueInput);
            dispatch(setZapAmount(zapValueInput));
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <KeyboardAvoidingView style={[globalStyles.screenContainer]} keyboardVerticalOffset={headerHeight} behavior='padding'>
            <Text style={globalStyles.textH2}>Payment Settings</Text>
            <View style={{ flex: 2, width: '80%'}}>
                <Input
                    textInputConfig={{
                        value: zapValueInput,
                        onChangeText: setZapValueInput,
                    }}
                    label="Default Zap Value"
                />
            </View>
            <View style={{ flex: 1, justifyContent: "space-evenly" }}>
                <CustomButton
                    text="Save"
                    buttonConfig={{ onPress: submitHandler }}
                />
                <CustomButton
                    text="Back"
                    secondary
                    buttonConfig={{
                        onPress: () => {
                            navigation.goBack();
                        },
                    }}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

export default SettingsPaymentsScreen;
