import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../styles/colors";
import { useState } from "react";

const FullScreenImage = ({ route, navigation }) => {
    const [imageNum, setImageNum] = useState(0);
    const imageUri = route?.params?.imageUri;

    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <Image
                style={{ width: "100%", maxHeight: "90%", flex: 1 }}
                source={imageUri[imageNum]}
                contentFit="cover"
            />
            <View
                style={{
                    position: "absolute",
                    right: 0,
                    left: 0,
                    top: 0,
                    bottom: 0,
                    justifyContent: "center",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <Ionicons
                        name="chevron-back"
                        color={colors.primary500}
                        size={64}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                    <Ionicons
                        name="chevron-forward"
                        color={colors.primary500}
                        size={64}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                </View>
            </View>
            <Ionicons
                name="close-circle"
                color={colors.primary500}
                size={32}
                style={{ position: "absolute", top: 32, right: 32 }}
                onPress={() => {
                    navigation.goBack();
                }}
            />
        </View>
    );
};

export default FullScreenImage;
