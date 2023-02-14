import { View, Text, FlatList, Pressable, Button } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { deleteValue } from "../../utils/secureStore";
import { logOut } from "../../features/authSlice";
import { resetAll } from "../../features/introSlice";
import { clearStore } from "../../features/messagesSlice";
import { clearUserStore } from "../../features/userSlice";
import { dbLogout } from "../../utils/database";
import colors from "../../styles/colors";
import * as Linking from "expo-linking";
import CustomButton from "../../components/CustomButton";
import {removeData} from '../../utils/cache/asyncStorage'

const settings = ["Payments", "Backup", "Network"];

const SettingItem = ({ item, onNav }) => {
    return (
        <Pressable
            style={({ pressed }) => [
                {
                    width: "100%",
                    backgroundColor: "#222222",
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                    borderRadius: 10,
                    marginBottom: 16,
                },
                pressed ? { backgroundColor: "#333333" } : undefined,
            ]}
            onPress={() => {
                onNav(item);
            }}
        >
            <Text style={[globalStyles.textBody, { textAlign: "left" }]}>
                {item}
            </Text>
        </Pressable>
    );
};

const SettingsHomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const navigationHandler = (route) => {
        navigation.navigate(route);
    };

    const loggedIn = useSelector((state) => state.auth.loggedIn);
    console.log(loggedIn);
    const logoutHandler = async () => {
        await deleteValue("privKey");
        await deleteValue("username");
        await deleteValue("mem");
        await dbLogout();
        await removeData(['twitterModalShown', 'zapAmount']);
        dispatch(clearStore());
        dispatch(clearUserStore());
        dispatch(logOut());
        dispatch(resetAll());
    };

    const introHandler = async () => {
        await removeData(['twitterModalShown', 'getStartedItemsShown']);
        dispatch(resetAll());
    };


    return (
        <View style={globalStyles.screenContainer}>
            <View style={{ width: "100%", flex: 1 }}>
                <FlatList
                    style={{ width: "100%", flexGrow: 0 }}
                    data={settings}
                    renderItem={({ item }) => (
                        <SettingItem item={item} onNav={navigationHandler} />
                    )}
                />
                <CustomButton
                    text="Reset Intro"
                    buttonConfig={{ onPress: introHandler }}
                    containerStyles={{marginBottom: 16}}
                />
                <CustomButton
                    text="Log Out"
                    buttonConfig={{ onPress: logoutHandler }}
                />
                
            </View>
            <Text
                style={[
                    globalStyles.textBody,
                    { color: colors.primary500, marginBottom: 16 },
                ]}
                onPress={() => {
                    Linking.openURL(
                        "https://app.getcurrent.io/terms-and-privacy"
                    );
                }}
            >
                Terms and Privacy
            </Text>
        </View>
    );
};

export default SettingsHomeScreen;
