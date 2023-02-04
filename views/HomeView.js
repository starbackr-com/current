import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import globalStyles from "../styles/globalStyles";
import { createStackNavigator } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";

import PostItem from "../components/PostItem";
import CommentScreen from "./home/CommentScreen";
import { getHomeFeed } from "../utils/nostrV2/getHomeFeed";
import { updateFollowedUsers } from "../utils/nostrV2/getUserData";
import GetStartedItems from "../components/GetStartedItems";
import LoadingSpinner from "../components/LoadingSpinner";


const HomeStack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const twitterModalShown = useSelector(
        (state) => state.intro.twitterModalShown
    );
    const users = useSelector((state) => state.messages.users);
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
    const messages = useSelector((state) => state.messages.messages);
    const rootNotes = messages.filter(message => message.root === true)

    const onLayoutViewHeight = (e) => {
        setHeight(e.nativeEvent.layout.height);
        if (!twitterModalShown) {
            navigation.navigate("TwitterModal");
        }
    };

    const onLayoutViewWidth = (e) => {
        setWidth(e.nativeEvent.layout.width);
    };

    const loadHomefeed = async () => {
        setIsLoading(true)
        await getHomeFeed(followedPubkeys);
        setIsLoading(false)
        updateFollowedUsers();
    };

    useEffect(() => {
        loadHomefeed();
    }, [followedPubkeys]);

    return (
        <View style={globalStyles.screenContainer} onLayout={onLayoutViewWidth}>
            {/* <GetStartedItems/> */}
            <View onLayout={onLayoutViewHeight} style={{flex:1 , width: '100%'}}>
            {messages && height && !isLoading ? (
                <View style={{ flex: 1, width: "100%", height: "100%" }}>
                    <FlashList
                        data={rootNotes}
                        renderItem={({ item }) => (
                            <PostItem
                                item={item}
                                height={height}
                                width={width}
                                user={users[item.pubkey]}
                            />
                        )}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        snapToInterval={(height / 100) * 80}
                        estimatedItemSize={height / 2}
                        directionalLockEnabled
                        onRefresh={async () => {
                            setIsFetching(true);
                            await getHomeFeed(followedPubkeys);
                            setIsFetching(false);
                        }}
                        refreshing={isFetching}
                        extraData={users}
                    />
                </View>
            ) : (
                <LoadingSpinner size={32}/>
            )}
            </View>
        </View>
    );
};

const HomeView = () => {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
            <HomeStack.Screen name="CommentScreen" component={CommentScreen} />
        </HomeStack.Navigator>
    );
};

export default HomeView;
