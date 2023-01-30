import {
    Pressable,
    useWindowDimensions,
    Image,
    ScrollView,
} from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../styles/colors";
import Input from "../../components/Input";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";
import { SvgCss } from "react-native-svg";

const CreateProfileScreen = ({ navigation, route }) => {
    const [bio, setBio] = useState(
        `This profile was created using current | https://getcurrent.io`
    );
    const device = useWindowDimensions();
    let data;

    const { image, svg, svgId, privKey, address } = route.params;

    if (image) {
        data = (
            <Pressable
                style={({ pressed }) => [
                    {
                        width: device.width / 5,
                        height: device.width / 5,
                        borderRadius: device.width / 10,
                        borderWidth: 2,
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
                        borderWidth: 2,
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
                        borderWidth: 2,
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
                    value: address.split("@")[0],
                    editable: false,
                }}
                inputStyle={{ marginBottom: 16 }}
            />
            <Input
                label="Bio"
                textInputConfig={{
                    multiline: true,
                    onChangeText: setBio,
                    value: bio,
                }}
                inputStyle={{ height: "20%" }}
            />
            <CustomButton
                text="Create Profile"
                buttonConfig={{ onPress: () => {
                    navigation.navigate('LoadingProfileScreen', {image, svg, svgId, privKey, address, bio})
                } }}
                containerStyles={{ marginTop: 32 }}
            />
        </ScrollView>
    );
};

export default CreateProfileScreen;
