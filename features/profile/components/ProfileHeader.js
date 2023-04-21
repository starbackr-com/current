import { View, Text, Platform } from "react-native";
import React from "react";
import BackButton from "../../../components/BackButton";
import { useIsAuthed } from "../hooks/useIsAuthed";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, globalStyles } from "../../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileHeader = ({ route, navigation }) => {
    const check = useIsAuthed(route?.params?.pubkey);
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{
                flexDirection: "row",
                width: "100%",
                backgroundColor: colors.backgroundPrimary,
                padding: 12,
                alignItems: "center",
                paddingTop: insets.top
            }}
        >
            <View style={{ width: "25%" }}>
                <BackButton
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
            </View>
            <View style={{ width: "50%" }}>
                <Text style={globalStyles.textBodyBold}>
                    {route?.params?.name || "Profile"}
                </Text>
            </View>
            {route.name === 'ProfileScreen' ?
                <View
                    style={{
                        width: "25%",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                    }}
                >
                    {check ? (
                        <Ionicons
                            name="pencil-sharp"
                            size={24}
                            color={colors.primary500}
                            onPress={() => {
                                navigation.navigate("EditProfileScreen");
                            }}
                        />
                    ) : (
                        <View />
                    )}
                    <Ionicons
                        name="qr-code"
                        size={24}
                        color={colors.primary500}
                        onPress={() => {
                            navigation.navigate("ProfileQRScreen", {pk: route?.params?.pubkey});
                        }}
                    />
                </View> : <View style={{width: '25%'}}/>
            }
        </View>
    );
};

export default ProfileHeader;
