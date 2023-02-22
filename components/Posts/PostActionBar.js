import { View, Text, Pressable } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../styles/colors";

const PostActionBar = ({onPressZap, onPressComment}) => {
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 32 }}>
            <Pressable
                style={({pressed}) => [{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 6,
                    borderRadius: 5,
                    width: "30%",
                    borderColor: colors.primary500,
                    borderWidth: 1,
                }, pressed ? {backgroundColor: '#333333'} : undefined]}
                onPress={onPressZap}
            >
                <Ionicons name="flash" color={colors.primary500} size={16} />
            </Pressable>
            <Pressable
                style={({pressed}) => [{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 6,
                    borderRadius: 5,
                    width: "30%",
                    borderColor: colors.primary500,
                    borderWidth: 1,
                }, pressed ? {backgroundColor: '#333333'} : undefined]}
                onPress={onPressComment}
            >
                <Ionicons name="chatbubble" color={colors.primary500} size={16} />
            </Pressable>
            <Pressable
                style={({pressed}) => [{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 6,
                    borderRadius: 5,
                    width: "30%",
                    borderColor: colors.primary500,
                    borderWidth: 1,
                }, pressed ? {backgroundColor: '#333333'} : undefined]}
                onPress={onPressComment}
            >
                <Ionicons name="menu" color={colors.primary500} size={16} />
            </Pressable>
        </View>
    );
};

export default PostActionBar;
