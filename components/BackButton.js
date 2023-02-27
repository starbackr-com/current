import { Pressable, Text, View } from "react-native";
import React from "react";
import globalStyles from "../styles/globalStyles";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const BackButton = ({ onPress }) => {
    return (
        <Pressable style={{ width: "100%", flexDirection: "row" }}>
                <Text
                    onPress={onPress}
                    style={[
                        globalStyles.textBody,
                        { color: colors.primary500, marginLeft: 6 },
                    ]}
                >
                    <Ionicons name="arrow-back" /> Back
                </Text>
        </Pressable>
    );
};

export default BackButton;
