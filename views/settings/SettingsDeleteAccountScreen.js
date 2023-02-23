import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHeaderHeight } from "@react-navigation/elements";
import { publishDeleteAccount } from "../../utils/nostrV2";
import { clearStore } from "../../features/messagesSlice";
import { clearUserStore } from "../../features/userSlice";
import { logOut } from "../../features/authSlice";
import { resetAll } from "../../features/introSlice";
import { deleteValue } from "../../utils/secureStore";
import { dbLogout } from "../../utils/database";
import { removeData } from "../../utils/cache/asyncStorage";
import { ActivityIndicator } from "react-native";
import { getValue } from "../../utils/secureStore";
import { deleteWallet } from "../../utils/wallet";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "../../components/BackButton";

const SettingsDeleteAccountScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [deleteInput, setDeleteInput] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const headerHeight = useHeaderHeight();
    const username = useSelector((state) => state.auth.username);

    const submitHandler = async () => {
        try {
            console.log(deleteInput);
            if (deleteInput === "DELETE") {
                setIsLoading(true);
                //Delete Wallet
                let privKey = await getValue("privKey");
                const result = await deleteWallet(privKey, username);
                console.log(result);

                //Publish kind0 delete account
                const successess = await publishDeleteAccount();

                //log them out
                if (successess.length > 1) {
                    await deleteValue("privKey");
                    await deleteValue("username");
                    await deleteValue("mem");
                    await dbLogout();
                    await removeData(["twitterModalShown", "zapAmount"]);
                    dispatch(clearStore());
                    dispatch(clearUserStore());
                    dispatch(logOut());
                    dispatch(resetAll());
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <KeyboardAvoidingView
            style={[globalStyles.screenContainer]}
            keyboardVerticalOffset={headerHeight}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                <View style={{ width: "100%" }}>
                    <BackButton
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                </View>
                <Text style={globalStyles.textH2}>Delete Account</Text>
                <Input
                    textInputConfig={{
                        value: deleteInput,
                        onChangeText: setDeleteInput,
                    }}
                    label="Type 'DELETE' to confirm"
                />
                {isLoading ? (
                    <ActivityIndicator
                        style={{
                            container: {
                                flex: 1,
                                justifyContent: "center",
                            },
                        }}
                        size={90}
                    />
                ) : (
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: "center",
                            marginTop: 6,
                        }}
                    >
                        <Ionicons
                            name="warning-outline"
                            color={colors.primary500}
                            size={32}
                        />
                        <Text style={globalStyles.textBody}>
                            Account deletion event will be pushed to all
                            connected relays. You will not be able to login with
                            this key again. Your wallet will be wiped out and
                            balance will be set to zero. Please move the balance
                            to another wallet before deletion.
                        </Text>
                    </View>
                )}
                <View style={{ flex: 2, width: "80%" }}></View>
                <View
                    style={{
                        width: "100%",
                        justifyContent: "space-evenly",
                        flexDirection: "row",
                        marginBottom: 5,
                    }}
                >
                    <CustomButton
                        text="Delete"
                        buttonConfig={{ onPress: submitHandler }}
                        disabled={deleteInput === "DELETE" ? false : true}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SettingsDeleteAccountScreen;
