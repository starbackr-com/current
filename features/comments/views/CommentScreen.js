import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    useWindowDimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import globalStyles from "../../../styles/globalStyles";
import Input from "../../../components/Input";
import { FlashList } from "@shopify/flash-list";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../../styles/colors";
import { useHeaderHeight } from "@react-navigation/elements";
import CommentHeader from "../components/CommentHeader";
import { useReplies } from "../hooks/useReplies";
import TextPost from "../../../components/Posts/TextPost";
import { useSelector } from "react-redux";
import BackButton from "../../../components/BackButton";
import ImagePost from "../../../components/Posts/ImagePost";
import { publishReply } from "../utils/publishReply";

const CommentScreen = ({ route, navigation }) => {
    const { eventId, type, rootId, nestedReplies, event } = route?.params;

    const [width, setWidth] = useState();
    const [input, setInput] = useState('');
    const listRef = useRef();
    const headerHeight = useHeaderHeight();
    const height = useWindowDimensions().height;
    const replies = useReplies(event.id);
    const users = useSelector((state) => state.messages.users);

    const onLayoutViewWidth = (e) => {
        setWidth(e.nativeEvent.layout.width);
    };

    const renderItem = ({ item }) => {
        if (item.kind === 1) {
            if (item.type === 'text') {
                return <TextPost event={item} user={users[item.pubkey]} />;
            } else if (item.type === 'image') {
                return <ImagePost event={item} user={users[item.pubkey]} width={width}/>
            }
        }
    };

    const submitHandler = async () => {
        listRef.current.prepareForLayoutAnimationRender();
        const success = await publishReply(input, event)
        console.log(success)
        if (!success) {
            alert('Something went wrong publishing your note...')
        } else {
            setInput('')
        }
    };

    return (
        <KeyboardAvoidingView
            style={[globalStyles.screenContainer, {paddingTop: 6}]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={headerHeight}
        >
            <View style={{width: '100%'}}>
                <BackButton onPress={() => {navigation.goBack()}}/>
            </View>
            <View style={{ flex: 1, width: "100%" }} onLayout={onLayoutViewWidth}>
                <FlashList
                    ListHeaderComponent={<CommentHeader parentEvent={event} />}
                    data={replies}
                    renderItem={renderItem}
                    extraData={users}
                    ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: colors.backgroundSecondary, width: '100%', marginVertical: 5}}/>}
                    estimatedItemSize={100}
                    ref={listRef}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <View style={{ width: "100%", flexDirection: "row", alignItems: 'center', backgroundColor: colors.backgroundPrimary, paddingVertical: 12}}>
                <View style={{ flex: 1}}>
                    <Input
                        textInputConfig={{ multiline: true, onChangeText: setInput, value: input }}
                        inputStyle={{ maxHeight: height / 5 }}
                    />
                </View>
                <Ionicons name="send" size={24} color={colors.primary500} style={{marginLeft: 12}} onPress={submitHandler}/>
            </View>
        </KeyboardAvoidingView>
    );
};

export default CommentScreen;
