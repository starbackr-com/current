import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import globalStyles from "../styles/globalStyles";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";


const ProfileScreen = ({ user }) => {
    let bannerImage =
        user?.bannerImage ||
        "https://pbs.twimg.com/media/Fm1N0dyXgAAoQDH?format=jpg&name=large";

    let profileImage =
        user?.picture ||
        "https://pbs.twimg.com/profile_images/1589236782381637633/wVdMF7jp_400x400.jpg";
    return (
        <View
            style={[
                globalStyles.screenContainer,
                {
                    paddingHorizontal: 0,
                    paddingTop: 0,
                    alignItems: "flex-start",
                },
            ]}
        >
            <Image
                source={{ uri: bannerImage }}
                style={{ width: "100%", height: "20%" }}
            />
            <Image
                style={{
                    width: 74,
                    height: 74,
                    marginLeft: 32,
                    borderRadius: 37,
                    marginTop: -37,
                    borderColor: colors.backgroundPrimary,
                    borderWidth: 4,
                }}
                source={{ uri: profileImage }}
            />
            <Pressable style={{position:'absolute', right: 16, top: 16, padding: 2, backgroundColor: colors.backgroundPrimary, borderRadius:18, alignItems:'center', justifyContent: 'center'}}><Ionicons name='close-circle' size={32} color={colors.primary500}/></Pressable>
            <View style={globalStyles.screenContainer}>
                <Text style={globalStyles.textBodyBold}>
                    {user?.name || "Egge"}
                </Text>
            </View>
        </View>
    );
};

export default ProfileScreen;
