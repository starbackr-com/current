import {
    Pressable,
    useWindowDimensions,
    Image,
    ScrollView,
    Switch,
    View,
    Text,
} from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../styles/colors";
import Input from "../../components/Input";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";
import { SvgCss } from "react-native-svg";
import { useEffect } from "react";

const CreateProfileScreen = ({ navigation, route }) => {
    const [bio, setBio] = useState();
    const [checked, setChecked] = useState(true);
    const device = useWindowDimensions();
    let data;

    const { image, svg, svgId, privKey, address, updateData, oldData } = route.params;

    const changeHandler = () => {
        setChecked((prev) => !prev);
    };

    useEffect(() => {
        if (oldData && JSON.parse(oldData?.content)?.about.length > 0) {
            setBio(JSON.parse(oldData.content)?.about || 'This profile was created using current | https://getcurrent.io')
        }
    }, [])

    //console.log(JSON.parse(oldData.content).lud16)

    if (image) {
        data = (
            <Pressable
                style={({ pressed }) => [
                    {
                        width: device.width / 5,
                        height: device.width / 5,
                        borderRadius: device.width / 10,
                        borderWidth: 1,
                        borderColor: colors.primary500,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 32,
                    },
                    pressed ? { backgroundColor: "#222222" } : undefined,
                ]}
                onPress={() => {
                    navigation.navigate("SelectImageScreen", {
                        privKey,
                        address,
                    });
                }}
            >
                <Image
                    source={{ uri: image.uri }}
                    style={{
                        width: device.width / 5,
                        height: device.width / 5,
                        borderRadius: device.width / 10,
                    }}
                />
            </Pressable>
        );
    } else if (svg) {
        data = (
            <Pressable
                style={({ pressed }) => [
                    {
                        width: device.width / 5,
                        height: device.width / 5,
                        borderRadius: device.width / 10,
                        borderWidth: 1,
                        borderColor: colors.primary500,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 32,
                    },
                    pressed ? { backgroundColor: "#222222" } : undefined,
                ]}
                onPress={() => {
                    navigation.navigate("SelectImageScreen", {
                        privKey,
                        address,
                    });
                }}
            >
                <SvgCss
                    xml={svg}
                    width={device.width / 5}
                    height={device.width / 5}
                />
            </Pressable>
        );
    } else {
        data = (
            <Pressable
                style={({ pressed }) => [
                    {
                        width: device.width / 5,
                        height: device.width / 5,
                        borderRadius: device.width / 10,
                        borderWidth: 1,
                        borderColor: colors.primary500,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 32,
                    },
                    pressed ? { backgroundColor: "#222222" } : undefined,
                ]}
                onPress={() => {
                    navigation.navigate("SelectImageScreen", {
                        privKey,
                        address,
                    });
                }}
            >
                <Ionicons
                    name="image-outline"
                    size={32}
                    color={colors.primary500}
                />
            </Pressable>
        );
    }

    return (
        <ScrollView
            style={globalStyles.screenContainerScroll}
            contentContainerStyle={{ alignItems: "center" }}
            keyboardShouldPersistTaps="handled"
        >
            {data}
            <Input
                label="Name"
                textInputConfig={{
                    value: updateData === 'all' ? JSON.parse(oldData.content).name : address.split("@")[0],
                    editable: false,
                }}
                inputStyle={{ marginBottom: 16, color: colors.primary600 }}
            />
            <Input
                label="Tip Address"
                textInputConfig={{
                    value: updateData === 'all' || updateData === 'ln' ? JSON.parse(oldData.content).lud16 : address,
                    editable: false,
                }}
                inputStyle={{ marginBottom: 16, color: colors.primary600}}
            />
            <Input
                label="Bio"
                textInputConfig={{
                    multiline: true,
                    onChangeText: setBio,
                    value: bio,
                }}
            />
            <View style={{ width: "100%", marginTop: 32 }}>
                <View
                    style={[{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#222222",
                        borderColor: "#333333",
                        borderWidth: 1,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 6,
                        width: "100%",
                        justifyContent: "space-evenly",
                    }, checked ? {borderColor: colors.primary500} : undefined]}
                >
                    <Text style={[globalStyles.textBody, !checked ? {color: '#666666'} : undefined]}>
                        Publish profile on nostr
                    </Text>
                    <Switch
                        trackColor={{
                            false: "#222222",
                            true: colors.primary500,
                        }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={changeHandler}
                        value={checked}
                        style={{ marginLeft: 12 }}
                    />
                </View>
                {!checked ? (
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
                        <Text style={globalStyles.textBodyS}>
                            If you don't publish your profile to the nostr
                            network, others won't be able to see your username,
                            profile-picture and bio...
                        </Text>
                    </View>
                ) : undefined}
            </View>
            <CustomButton
                text="Create Profile"
                buttonConfig={{
                    onPress: () => {
                        navigation.navigate("LoadingProfileScreen", {
                            image,
                            svg,
                            svgId,
                            privKey,
                            address,
                            bio,
                            publishProfile: checked
                        });
                    },
                }}
                containerStyles={{ marginTop: 32 }}
            />
        </ScrollView>
    );
};

export default CreateProfileScreen;
