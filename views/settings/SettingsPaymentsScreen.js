import { View, Text } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/CustomButton";
import { useEffect } from "react";
import { useState } from "react";
import { setZapAmount } from "../../features/userSlice";
import { storeData } from "../../utils/cache/asyncStorage";

const SettingsPaymentsScreen = ({ navigation }) => {
    const { zapAmount } = useSelector((state) => state.user);
    const [zapValueInput, setZapValueInput] = useState();
    const dispatch = useDispatch();

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
        <View style={[globalStyles.screenContainer]}>
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
        </View>
    );
};

export default SettingsPaymentsScreen;
