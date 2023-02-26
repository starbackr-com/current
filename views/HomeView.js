import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalStyles from "../styles/globalStyles";
import { createStackNavigator } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";
import PostItem from "../components/PostItem";
import CommentScreen from "./home/CommentScreen";
import { getHomeFeed } from "../utils/nostrV2/getHomeFeed";
import { updateFollowedUsers } from "../utils/nostrV2/getUserData";
import Lottie from "lottie-react-native";
import { storeData } from "../utils/cache/asyncStorage";
import { setTwitterModal } from "../features/introSlice";
import GetStartedItems from "../features/homefeed/components/GetStartedItems";
import ImagePost from "../features/homefeed/components/ImagePost";
import { ActivityIndicator } from "react-native";
import { getZaps } from "../features/zaps/utils/getZaps";
import CustomButton from "../components/CustomButton";

const HomeStack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [playAnimation, setPlayAnimation] = useState(false);
    const [zaps, setZaps] = useState();
    const [page, setPage] = useState(1);
    const twitterModalShown = useSelector(
        (state) => state.intro.twitterModalShown
    );
    const users = useSelector((state) => state.messages.users);
    const followedPubkeys = useSelector((state) => state.user.followedPubkeys);
    const zapAmount = useSelector(state => state.user.zapAmount)
    const messages = useSelector((state) => state.messages.messages);
    const rootNotes = messages.filter((message) => message.root === true);

    const animation = useRef();
    const dispatch = useDispatch();

    const onLayoutViewHeight = (e) => {
        setHeight(e.nativeEvent.layout.height);
        if (!twitterModalShown) {
            navigation.navigate("TwitterModal");
            dispatch(setTwitterModal());
            storeData("twitterModalShown", "true");
        }
    };

    const onLayoutViewWidth = (e) => {
        setWidth(e.nativeEvent.layout.width);
    };

    const loadZaps = async (postObj) => {
        const postArray = Object.keys(postObj).map((key) => postObj[key])
        const arrayOfIds = postArray.map((event) => event.id);
        const allZaps = await getZaps(arrayOfIds);
        setZaps(prev => Object.assign(prev ? prev : {}, allZaps));
    };

    const loadMoreItems = async () => {
        if (isLoading) {
            return;
        }
        console.log(`Getting page ${page}`);
        setIsLoading(true);
        const postObj = await getHomeFeed(followedPubkeys, page);
        setIsLoading(false);
        loadZaps(postObj)
        setPage((prev) => prev + 1);
    };

    const loadHomefeed = async () => {
        setIsLoading(true);
        const now = new Date() / 1000;
        const postObj = await getHomeFeed(followedPubkeys, 0);
        setIsLoading(false);
        loadZaps(postObj)

        updateFollowedUsers();
    };

    const renderPost = ({ item }) => {
        if (item.type === "image") {
            return (
                <ImagePost
                    item={item}
                    height={height}
                    width={width}
                    user={users[item.pubkey]}
                    zapSuccess={playZapAnimation}
                    zapAmount={zapAmount}
                    zaps={zaps ? zaps[item.id] : null}
                />
            );
        } else {
            return (
                <PostItem
                    item={item}
                    height={height}
                    width={width}
                    user={users[item.pubkey]}
                    zapSuccess={playZapAnimation}
                    zapAmount={zapAmount}
                    zaps={zaps ? zaps[item.id] : null}
                />
            );
        }
    };

    const playZapAnimation = () => {
        setPlayAnimation(true);
        setTimeout(() => {
            setPlayAnimation(false);
        }, 1000);
    };

    useEffect(() => {
        loadHomefeed();
    }, []);

    return (
        <View
            style={[globalStyles.screenContainer, { paddingTop: 12 }]}
            onLayout={onLayoutViewWidth}
        >
            <GetStartedItems />
            <View
                onLayout={onLayoutViewHeight}
                style={{ flex: 1, width: "100%" }}
            >
                {rootNotes.length > 2 && height ? (
                    <View style={{ flex: 1, width: "100%", height: "100%" }}>
                        <FlashList
                            data={rootNotes}
                            renderItem={renderPost}
                            snapToAlignment="start"
                            decelerationRate="fast"
                            snapToInterval={(height / 100) * 90}
                            estimatedItemSize={(height / 100) * 90}
                            directionalLockEnabled
                            onRefresh={async () => {
                                setIsFetching(true);
                                await loadHomefeed();
                                setIsFetching(false);
                            }}
                            refreshing={isFetching}
                            extraData={[users, zapAmount, zaps]}
                            getItemType={(item) => item.type}
                            onEndReached={loadMoreItems}
                            onEndReachedThreshold={2}
                            ListFooterComponent={
                                <CustomButton
                                    text="Load More"
                                    buttonConfig={{ onPress: loadMoreItems }}
                                />
                            }
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                ) : (
                    <ActivityIndicator
                        style={{
                            container: {
                                flex: 1,
                                justifyContent: "center",
                            },
                        }}
                        size={90}
                    />
                )}
                {playAnimation ? (
                    <View
                        style={{
                            position: "absolute",
                            right: 0,
                            left: 0,
                            top: 0,
                            bottom: 0,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Lottie
                            autoPlay
                            loop={false}
                            ref={animation}
                            style={{
                                position: "absolute",
                                width: (width / 100) * 80,
                                height: (width / 100) * 80,
                            }}
                            source={require("../assets/zap-success.json")}
                        />
                    </View>
                ) : undefined}
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
