import { View, Text, FlatList, Pressable, Button } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import { useDispatch } from "react-redux";
import { deleteValue } from "../../utils/secureStore";
import { logOut } from "../../features/authSlice";

const settings = ["General", "Payments", "Backup", "Network", "Security & Privacy"];

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
                onNav(item)
            }}
        >
            <Text style={[globalStyles.textBody, { textAlign: "left" }]}>
                {item}
            </Text>
        </Pressable>
    );
};

const SettingsHomeScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const navigationHandler = (route) => {
        navigation.navigate(route)
    };
    const logoutHandler = () => {
        deleteValue('privKey')
        deleteValue('username')
        dispatch(logOut())
    }

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Settings</Text>
            <FlatList
                style={{ width: "100%" }}
                data={settings}
                renderItem={({ item }) => <SettingItem item={item} onNav={navigationHandler}/>}
            />
            <Button title='ProfileScreen' onPress={() => {navigation.navigate('ProfileModal')}}/>
            <Button title='Log Out' onPress={logoutHandler}>SettingsView</Button>
        </View>
    );
};

export default SettingsHomeScreen;
