import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import globalStyles from "../styles/globalStyles";
import { createStackNavigator } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";

import PostItem from "../components/PostItem";
import { getFeed } from "../utils/nostr";
import CommentScreen from "./home/CommentScreen";

const HomeStack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();
    const [isFetching, setIsFetching] = useState(false);
    const twitterModalShown = useSelector(
        (state) => state.intro.twitterModalShown
    );
    const users = useSelector((state) => state.messages.users);
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);

    const messages = useSelector((state) => state.messages.messages);

    const onLayoutView = (e) => {
        setHeight(e.nativeEvent.layout.height);
        setWidth(e.nativeEvent.layout.width);
        if (!twitterModalShown) {
            navigation.navigate("TwitterModal");
        }
    };

    useEffect(() => {
        try {
            getFeed(followedPubkeys);
        } catch{
            console.log('No Homefeed!')
        }
    }, [followedPubkeys]);

    return (
        <View style={globalStyles.screenContainer} onLayout={onLayoutView}>
            {messages && height ? (
                <View style={{ flex: 1, width: "100%", height: "100%" }}>
                    <FlashList
                        data={messages}
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
                            setIsFetching(true)
                            await getFeed(followedPubkeys)
                            setIsFetching(false)
                        }}
                        refreshing={isFetching}
                        extraData={users}
                    />
                </View>
            ) : (
                <Text>There is nothing here...</Text>
            )}
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
