import { View, Text, Pressable } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../styles/colors";

const PostActionBar = ({
    onPressZap,
    onPressComment,
    onPressMore,
    zapDisabled,
}) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 32,
            }}
        >
            <Pressable
                style={({ pressed }) => [
                    {
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 6,
                        borderRadius: 5,
                        width: "30%",
                    },
                    pressed && !zapDisabled
                        ? { backgroundColor: "#333333" }
                        : undefined,
                ]}
                onPress={!zapDisabled ? onPressZap : undefined}
            >
                <Ionicons
                    name="flash-outline"
                    color={zapDisabled ? "grey" : colors.primary500}
                    size={16}
                />
            </Pressable>
            <Pressable
                style={({ pressed }) => [
                    {
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 6,
                        borderRadius: 5,
                        width: "30%",
                    },
                    pressed ? { backgroundColor: "#333333" } : undefined,
                ]}
                onPress={onPressComment}
            >
                <Ionicons
                    name="chatbubble-outline"
                    color={colors.primary500}
                    size={16}
                />
            </Pressable>
            <Pressable
                style={({ pressed }) => [
                    {
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 6,
                        borderRadius: 5,
                        width: "30%",
                    },
                    pressed ? { backgroundColor: "#333333" } : undefined,
                ]}
                onPress={onPressMore}
            >
                <Ionicons
                    name="ellipsis-horizontal-circle"
                    color={colors.primary500}
                    size={16}
                />
            </Pressable>
        </View>
    );
};

export default PostActionBar;
