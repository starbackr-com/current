import { View, Text, Pressable } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import globalStyles from "../../styles/globalStyles";
import CustomButton from "../../components/CustomButton";
import { muteUser } from "../../utils/users";
import * as Clipboard from 'expo-clipboard';
import { encodeNoteID } from "../../utils/nostr/keys";
import { publishRepost } from "../../utils/nostrV2";
import { useState } from "react";

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
    const { event } = route.params;
    const { id, pubkey } = event;
    const [repostLoading, setRepostLoading] = useState(false)
    const dispatch = useDispatch();

    const muteHandler = async () => {
        try {
            await muteUser(pubkey);
            navigation.goBack();
        } catch (e) {
            console.log(e);
        }
    };

    const repostHandler = async () => {
        setRepostLoading(true);
        await publishRepost(id, pubkey);
        setRepostLoading(false);
        navigation.goBack();
    };

    const downvoteHandler = () => {};

    const reportHandler = () => {
        navigation.goBack();
        navigation.navigate("ReportPostModal", { event });
    };

    const copyEventHandler = async () => {
        const bech32Note = encodeNoteID(id)
        console.log(bech32Note)
        await Clipboard.setStringAsync(bech32Note);
    };

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
                        <ActionButton
                            text="Repost Event"
                            icon="repeat"
                            onPress={repostHandler}
                        />
                        <ActionButton
                            text="Report Content"
                            icon="alert-circle"
                            onPress={reportHandler}
                        />
                        <ActionButton
                            text="Mute User"
                            icon="volume-mute"
                            onPress={muteHandler}
                        />
                        <ActionButton
                            text="Copy Event"
                            icon="clipboard-outline"
                            onPress={copyEventHandler}
                        />
                    </View>
                    <CustomButton
                        text="Close"
                        containerStyles={{ width: "25%", alignItems: "center" }}
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
