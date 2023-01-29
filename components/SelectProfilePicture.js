import { Image, Text, Pressable, useWindowDimensions } from "react-native";
import React from "react";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SvgCss } from "react-native-svg";

const SelectProfilePicture = ({ onPress, image, svg}) => {
    const device = useWindowDimensions();

    if (image) {
        return (
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
                onPress={onPress}
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
        return (
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
                onPress={onPress}
            >
                    <SvgCss xml={svg} width={device.width / 5} height={device.width / 5}/>
            </Pressable>
        );
    } else {
        return (
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
                onPress={onPress}
            >
                <Ionicons
                    name="image-outline"
                    size={32}
                    color={colors.primary500}
                />
            </Pressable>
        );
    }
};

export default SelectProfilePicture;
