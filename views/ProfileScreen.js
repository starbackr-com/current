import { View, Text, Image, Pressable } from "react-native";
import React, { useState } from "react";
import globalStyles from "../styles/globalStyles";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import CustomButton from "../components/CustomButton";
import { FlashList } from "@shopify/flash-list";

const ProfileScreen = ({ route, navigation }) => {
    const pubkey = route.params.user;
    const user = useSelector((state) => state.messages.users[pubkey]);
    const [feed, setFeed] = useState();

    let bannerImage =
        user?.bannerImage ||
        "https://images.unsplash.com/photo-1674511564261-4cda0b8ac9f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80";

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
                source={require('../assets/placeholder.png')}
                style={{ width: "100%", height: "20%"}}
            />
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 12}}>
            <Image
                style={{
                    width: 74,
                    height: 74,
                    borderRadius: 37,
                    borderColor: colors.backgroundPrimary,
                    borderWidth: 4,
                }}
                source={{ uri: profileImage }}
            />
            <CustomButton text='Edit Profile' buttonConfig={{onPress: () => {alert('Coming Soon!')}}}/>
            </View>
            <Pressable
                style={{
                    position: "absolute",
                    top: 16,
                    width: 40,
                    height: 40,
                    backgroundColor: colors.backgroundPrimary,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                }}
                onPress={() => {navigation.goBack();}}
            >
                <Ionicons
                    name="chevron-down"
                    size={32}
                    color={colors.primary500}
                />
            </Pressable>
            <View style={{ padding: 12 }}>
                <Text
                    style={[globalStyles.textBodyBold, { textAlign: "left" }]}
                >
                    {user?.name}
                </Text>
                <Text style={[globalStyles.textBody, { textAlign: "left" }]}>
                    {user?.about}
                </Text>
            </View>
            <CustomButton text="Load Feed" />
            {feed ? <FlashList/> : undefined}
        </View>
    );
};

export default ProfileScreen;
