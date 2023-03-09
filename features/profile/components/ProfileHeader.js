import { View, Text } from "react-native";
import React from "react";
import BackButton from "../../../components/BackButton";
import CustomButton from "../../../components/CustomButton";
import globalStyles from "../../../styles/globalStyles";
import colors from "../../../styles/colors";
import { useIsAuthed } from "../hooks/useIsAuthed";
import { useNavigation } from "@react-navigation/native";

const ProfileHeader = ({ route }) => {
    const check = useIsAuthed(route.params.params.pubkey);
    const navigation = useNavigation();
    return (
        <View
            style={{
                flexDirection: "row",
                width: "100%",
                backgroundColor: colors.backgroundPrimary,
                padding: 12,
                alignItems: "center",
            }}
        >
            <View style={{ width: "25%" }}>
                <BackButton onPress={() => {navigation.goBack()}}/>
            </View>
            <View style={{ width: "50%" }}>
                <Text style={globalStyles.textBodyBold}>
                    {route?.params?.params?.name || "Profile"}
                </Text>
            </View>
            <View style={{ width: "25%" }}>
                {check ? <CustomButton text="Edit" /> : <View/>}
            </View>
        </View>
    );
};

export default ProfileHeader;
