import { View, Text, Button, Pressable } from "react-native";
import React from "react";
import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import globalStyles from "../styles/globalStyles";
import CustomButton from "../components/CustomButton";
import { useDispatch } from "react-redux";
import { mutePubkey } from "../features/userSlice";

const ActionButton = ({ onPress, icon, text }) => {
    return (
        <Pressable
            style={{
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 5,
                borderRadius: 10,
                backgroundColor: "#333333",
                width: "20%",
            }}
            onPress={onPress}
        >
            <Ionicons name={icon} size={32} color="white" />
            <Text
                style={[
                    globalStyles.textBody,
                    {
                        fontSize: 8,
                        margin: 5,
                        textAlign: "center",
                    },
                ]}
            >
                {text}
            </Text>
        </Pressable>
    );
};

const PostMenuModal = ({ navigation, route }) => {
    const { id, pubkey } = route.params.event;
    const dispatch = useDispatch();

    const muteHandler = () => {
        dispatch(mutePubkey(pubkey))
    };

    const upvoteHandler = () => {};

    const downvoteHandler = () => {};

    const reportHandler = () => {};
    return (
        <>
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#18181b",
                    opacity: 0.5,
                }}
            ></View>
            <View
                style={{
                    flex: 1,
                    flexDirection: "column-reverse",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: "95%",
                        backgroundColor: "#222222",
                        borderRadius: 10,
                        paddingVertical: 32,
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                            paddingVertical: 16,
                            width: "100%",
                        }}
                    >
                        {/* <ActionButton text="Upvote" icon="arrow-up" onPress={upvoteHandler}/>
                        <ActionButton text="Downvote" icon="arrow-down" onPress={downvoteHandler}/> */}
                        <ActionButton text="Report" icon="alert-circle" onPress={reportHandler}/>
                        <ActionButton text="Mute User" icon="close" onPress={muteHandler}/>
                    </View>
                    <CustomButton
                        text="Close"
                        containerStyles={{ width: "25%", alignItems: 'center'}}
                        buttonConfig={{
                            onPress: () => {
                                navigation.goBack();
                            },
                        }}
                    />
                </View>
            </View>
        </>
    );
};

export default PostMenuModal;
