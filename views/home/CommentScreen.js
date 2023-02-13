import { View, Text, KeyboardAvoidingView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "../../styles/globalStyles";
import { FlashList } from "@shopify/flash-list";
import { getReplies, getUserData, publishReply } from "../../utils/nostrV2";
import colors from "../../styles/colors";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import Input from "../../components/Input";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHeaderHeight } from "@react-navigation/elements";
import BackButton from "../../components/BackButton";

const ReplyItem = ({ event, user, replies }) => {
    if (event.tags.length > 2) {
        console.log(event)
    }
    const getAge = (timestamp) => {
        const now = new Date();
        const timePassedInMins = Math.floor(
            (now - new Date(timestamp * 1000)) / 1000 / 60
        );

        if (timePassedInMins < 60) {
            return `${timePassedInMins}min ago`;
        } else if (timePassedInMins >= 60 && timePassedInMins < 1440) {
            return `${Math.floor(timePassedInMins / 60)}h ago`;
        } else if (timePassedInMins >= 1440 && timePassedInMins < 10080) {
            return `${Math.floor(timePassedInMins / 1440)}d ago`;
        } else {
            return `on ${new Date(timestamp * 1000).toLocaleDateString()}`;
        }
    };
    return (
        <View
            style={{
                backgroundColor: colors.backgroundSecondary,
                padding: 6,
                borderRadius: 6,
                marginBottom: 12,
            }}
        >
            <Text
                style={[
                    globalStyles.textBodyBold,
                    { textAlign: "left", width: "50%" },
                ]}
                numberOfLines={1}
            >
                {user?.name || event.pubkey}
            </Text>
            <Text style={[globalStyles.textBody, { textAlign: "left" }]}>
                {event.content}
            </Text>
            <Text
                style={[
                    globalStyles.textBodyS,
                    { textAlign: "right", marginTop: 12 },
                ]}
            >
                {getAge(event.created_at)}
            </Text>
        </View>
    );
};

const CommentScreen = ({ route, navigation }) => {
    const { eventId } = route?.params;
    const [replies, setReplies] = useState();
    const [allReplies, setAllReplies] = useState();
    const [reply, setReply] = useState();
    const [sending, setSending] = useState(false);

    const users = useSelector((state) => state.messages.users);

    const getAllReplies = async () => {
        const response = await getReplies([eventId]);
        const pubkeys = Object.keys(response).map(
            (key) => response[key].pubkey
        );
        const array = Object.keys(response).map((key) => response[key]);
        setAllReplies(array)
        const firstOrderReplies = array
            .filter(
                (item) =>
                    item.tags.filter((item) => item[0] === "e").length === 1
            )
            .sort((a, b) => {
                return a.created_at < b.created_at ? 1 : -1;
            });

        setReplies(firstOrderReplies);
        getUserData(pubkeys);
    };

    const submitHandler = async () => {
        if (reply.length < 1) {
            console.log("Comment to short!");
            return;
        }
        setSending(true);
        try {
            const data = await publishReply(reply, eventId);
            const newArray = [data.event, ...replies];
            setReplies(newArray);
            setReply("");
        } catch (e) {
            console.log(e);
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        getAllReplies();
    }, []);

    const headerHeight = useHeaderHeight();
    return (
        <KeyboardAvoidingView
            style={globalStyles.screenContainer}
            behavior="padding"
            keyboardVerticalOffset={headerHeight}
        >
            <View style={{alignItems: 'flex-start', width: '100%', marginBottom: 12 }}>
                <BackButton onPress={() => {navigation.goBack()}}/>
            </View>

            <View
                style={{
                    flex: 4,
                    width: "100%",
                    borderColor: colors.primary500,
                    borderWidth: 1,
                    padding: 6,
                    borderRadius: 10,
                }}
            >
                {replies ? (
                    <FlashList
                        data={replies}
                        renderItem={({ item }) => (
                            <ReplyItem event={item} user={users[item.pubkey]} replies={allReplies.filter(reply => reply.tags.filter(tag => tag[0] === 'e').length > 1)}/>
                        )}
                        estimatedItemSize={80}
                        extraData={users}
                        inverted
                    />
                ) : (
                    <View
                        style={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <LoadingSpinner size={32} />
                    </View>
                )}
            </View>
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <View style={{ width: "60%", flex: 1 }}>
                    <Input
                        inputStyle={{ height: "80%" }}
                        textInputConfig={{
                            onChangeText: setReply,
                            value: reply,
                            multiline: true,
                        }}
                        alignment="left"
                    />
                </View>
                <Pressable
                    onPress={submitHandler}
                    style={{ marginLeft: 12 }}
                    disabled={sending}
                >
                    {!sending ? (
                        <Ionicons
                            name="send"
                            size={24}
                            color={colors.primary500}
                        />
                    ) : (
                        <LoadingSpinner size={24} />
                    )}
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

export default CommentScreen;
