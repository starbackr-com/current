import { View, Text, FlatList, Pressable, Button } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import { useDispatch } from "react-redux";
import { deleteValue } from "../../utils/secureStore";
import { logOut } from "../../features/authSlice";
import { dbLogout } from "../../utils/database";
import colors from "../../styles/colors";
import * as Linking from 'expo-linking';

const settings = [
    "General",
    "Payments",
    "Backup",
    "Network",
    "Security & Privacy",
];

const SettingItem = ({ item, onNav }) => {
    return (
        <Pressable
            style={({ pressed }) => [
                {
                    width: "100%",
                    backgroundColor: "#222222",
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
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
    const logoutHandler = async () => {
        await deleteValue("privKey");
        await deleteValue("username");
        await deleteValue('mem')
        await dbLogout();

        dispatch(logOut());
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Settings</Text>
            <FlatList
                style={{ width: "100%" }}
                data={settings}
                renderItem={({ item }) => (
                    <SettingItem item={item} onNav={navigationHandler} />
                )}
            />
            <Button title="Log Out" onPress={logoutHandler}/>
            <Text style={[globalStyles.textBody, {color: colors.primary500}]} onPress={() => {Linking.openURL('https://app.getcurrent.io/terms-and-privacy')}}>Terms and Privacy</Text>
        </View>
    );
};

export default SettingsHomeScreen;
