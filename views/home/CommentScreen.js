import {
    View,
    Text,
    KeyboardAvoidingView,
    Pressable,
    useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import globalStyles from "../../styles/globalStyles";
import { FlashList } from "@shopify/flash-list";
import { publishReply } from "../../utils/nostrV2";
import colors from "../../styles/colors";
import { useSelector } from "react-redux";
import Input from "../../components/Input";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHeaderHeight } from "@react-navigation/elements";
import BackButton from "../../components/BackButton";
import { useNavigation } from "@react-navigation/native";
import ZapItem from "../../features/zaps/components/ZapItem";
import { useSubscribeReplies } from "../../hooks/useSubscribeReplies";
import { getAge } from "../../features/shared/utils/getAge";
import ImagePost from "../../components/Posts/ImagePost";
import TextPost from "../../components/Posts/TextPost";
import PostActionBar from "../../components/Posts/PostActionBar";

const Header = ({ event, user, rootId, replies }) => {
    return (
        <View
            style={{
                padding: 6,
                marginBottom: 36,
                borderBottomWidth: 4,
                borderColor: colors.primary500,
            }}
        >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6}}>
                <Text
                    style={[
                        globalStyles.textBodyBold,
                        { textAlign: "left"},
                    ]}
                    numberOfLines={1}
                    onPress={() => {
                        navigation.navigate("Profile", {
                            screen: "ProfileScreen",
                            params: { pubkey: event.pubkey },
                        });
                    }}
                >
                    {user?.name || event.pubkey}
                </Text>
                <Text
                    style={[
                        globalStyles.textBodyS,
                        { textAlign: "right",},
                    ]}
                >
                    {getAge(event.created_at)}
                </Text>
            </View>
            <Text style={[globalStyles.textBody, { textAlign: "left" }]}>
                {event.content}
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            ></View>
            <PostActionBar />
        </View>
    );
};

const CommentScreen = ({ route, navigation }) => {
    const { eventId, type, rootId, nestedReplies, event } = route?.params;
    const [replies, setReplies] = useState();
    const [allReplies, setAllReplies] = useState();
    const [reply, setReply] = useState();
    const [sending, setSending] = useState(false);
    const [width, setWidth] = useState();

    const users = useSelector((state) => state.messages.users);
    const device = useWindowDimensions();

    const data = useSubscribeReplies([eventId]);
    let array;
    if (type === "root") {
        array = Object.keys(data)
            .map((key) => data[key])
            .filter((item) => item.repliesTo === eventId)
            .sort((a, b) => b.created_at - a.created_at);
        console.log(array.length);
    } else {
        array = Object.keys(data)
            .map((key) => data[key])
            .filter((item) => item.repliesTo != item.root)
            .sort((a, b) => b.created_at - a.created_at);
    }

    const renderItem = ({ item }) => {
        if (item.kind === 1) {
            if (item.type === "image") {
                return (
                    <ImagePost
                        event={item}
                        user={users[item.pubkey]}
                        width={width}
                    />
                );
            } else if (item.type === "text") {
                return <TextPost event={item} user={users[item.pubkey]} />;
            }
        } else if (item.kind === 9735) {
            return (
                <ZapItem
                    event={item}
                    user={users[item.payer]}
                    replies={item.replies}
                    rootId={rootId}
                />
            );
        }
    };
    const submitHandler = async () => {
        if (reply.length < 1) {
            console.log("Comment to short!");
            return;
        }
        setSending(true);
        try {
            if (type === "root") {
                const data = await publishReply(reply, rootId);
                console.log(data);
                data.event.replies = [];
                const newArray = replies
                    ? [data.event, ...replies]
                    : [data.event];
                setReplies(newArray);
                setReply("");
            } else if (type === "reply") {
                const data = await publishReply(reply, rootId, eventId);
                data.event.replies = [];
                const newArray = [data.event, ...replies];
                setReplies(newArray);
                setReply("");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setSending(false);
        }
    };

    const headerHeight = useHeaderHeight();
    return (
        <KeyboardAvoidingView
            style={[globalStyles.screenContainer, { paddingHorizontal: 0 }]}
            behavior="padding"
            keyboardVerticalOffset={headerHeight}
        >
            <View style={{ width: "100%", marginBottom: 6 }}>
                <BackButton onPress={() => {navigation.goBack()}}/>
            </View>
            <View
                style={{ flex: 1, width: "100%" }}
                onLayout={(e) => {
                    setWidth(e.nativeEvent.layout.width);
                }}
            >
                <FlashList
                    data={array}
                    renderItem={renderItem}
                    estimatedItemSize={80}
                    extraData={users}
                    ListHeaderComponent={
                        <Header
                            event={event}
                            user={users[event.pubkey]}
                            rootId={rootId}
                        />
                    }
                />
            </View>
            <View
                style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: 6,
                }}
            >
                <Input
                    inputStyle={{
                        flex: 1,
                        maxHeight: (device.height / 100) * 10,
                    }}
                    textInputConfig={{ multiline: true }}
                />
                <Ionicons
                    name="send"
                    size={24}
                    color={colors.primary500}
                    style={{ marginLeft: 12 }}
                />
            </View>
        </KeyboardAvoidingView>
        // <KeyboardAvoidingView
        //     style={[globalStyles.screenContainer, { paddingHorizontal: 0 }]}
        //     behavior="padding"
        //     keyboardVerticalOffset={headerHeight}
        // >
        //     <View
        //         style={{
        //             alignItems: "flex-start",
        //             width: "100%",
        //             marginBottom: 12,
        //             paddingHorizontal: 16,
        //         }}
        //     >
        //         <BackButton
        //             onPress={() => {
        //                 navigation.goBack();
        //             }}
        //         />
        //     </View>

        //     <View
        //         style={{
        //             flex: 4,
        //             width: "100%",
        //             padding: 6,
        //             borderRadius: 10,
        //         }}
        //     >
        //         {array ? (
        //             <FlashList
        //                 data={array}
        //                 renderItem={renderItem}
        //                 estimatedItemSize={80}
        //                 extraData={users}
        //                 inverted
        //             />
        //         ) : (
        //             <View
        //                 style={{
        //                     width: "100%",
        //                     justifyContent: "center",
        //                     alignItems: "center",
        //                 }}
        //             >
        //                 <LoadingSpinner size={32} />
        //             </View>
        //         )}
        //     </View>
        //     <View
        //         style={{
        //             flex: 1,
        //             width: "100%",
        //             flexDirection: "row",
        //             alignItems: "center",
        //             paddingHorizontal: 16,
        //         }}
        //     >
        //         <View style={{ width: "60%", flex: 1 }}>
        //             <Input
        //                 inputStyle={{ height: "80%" }}
        //                 textInputConfig={{
        //                     onChangeText: setReply,
        //                     value: reply,
        //                     multiline: true,
        //                 }}
        //                 alignment="left"
        //             />
        //         </View>
        //         <Pressable
        //             onPress={submitHandler}
        //             style={{ marginLeft: 12 }}
        //             disabled={sending}
        //         >
        //             {!sending ? (
        //                 <Ionicons
        //                     name="send"
        //                     size={24}
        //                     color={colors.primary500}
        //                 />
        //             ) : (
        //                 <LoadingSpinner size={24} />
        //             )}
        //         </Pressable>
        //     </View>
        // </KeyboardAvoidingView>
    );
};

export default CommentScreen;
