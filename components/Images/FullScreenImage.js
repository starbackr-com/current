import { View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../styles/colors";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FullScreenImage = ({ route, navigation }) => {
    const [imageNum, setImageNum] = useState(0);
    const imageUri = route?.params?.imageUri;

    const nextHandler = () => {
        if (imageUri.length - 1 > imageNum) {
            setImageNum((prev) => prev + 1);
        }
    };

    const prevHandler = () => {
        if (imageNum > 0) {
            setImageNum((prev) => prev - 1);
        }
    };

    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "rgba(52, 52, 52, 0.8)",
                overflow: "hidden",
            }}
        >
            <Image
                style={{ width: "100%", maxHeight: "90%", flex: 1 }}
                source={imageUri[imageNum]}
                contentFit="contain"
                
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
                    {imageNum > 0 ? (
                        <Ionicons
                            name="chevron-back"
                            color={colors.primary500}
                            size={52}
                            onPress={prevHandler}
                        />
                    ) : (
                        <View />
                    )}
                    {imageUri.length - 1 > imageNum ? (
                        <Ionicons
                            name="chevron-forward"
                            color={colors.primary500}
                            size={52}
                            onPress={nextHandler}
                        />
                    ) : (
                        <View />
                    )}
                </View>
                <Ionicons
                    name="close-circle"
                    color={colors.primary500}
                    size={32}
                    style={{ position: "absolute", top: insets.top, right: 16 }}
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
            </View>
        </View>
    );
};

export default FullScreenImage;
