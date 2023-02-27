import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalStyles from "../styles/globalStyles";
import { createStackNavigator } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";
import PostItem from "../components/PostItem";
import CommentScreen from "./home/CommentScreen";
import { storeData } from "../utils/cache/asyncStorage";
import { setTwitterModal } from "../features/introSlice";
import GetStartedItems from "../features/homefeed/components/GetStartedItems";
import ImagePost from "../features/homefeed/components/ImagePost";
import { ActivityIndicator } from "react-native";
import { getZaps } from "../features/zaps/utils/getZaps";
import { useHomefeed } from "../features/homefeed/hooks/useHomefeed";

const HomeStack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();
    const [zaps, setZaps] = useState();
    const [checkedZaps, setCheckedZaps] = useState([]);
    const twitterModalShown = useSelector(
        (state) => state.intro.twitterModalShown
    );
    const users = useSelector((state) => state.messages.users);
    const zapAmount = useSelector((state) => state.user.zapAmount);
    const now = new Date() / 1000;
    const [data, page, setNewPage] = useHomefeed(now);
    const sorted = data.sort((a, b) => b.created_at - a.created_at);
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

    const loadZaps = async (arrayOfIds) => {
        const allZaps = await getZaps(arrayOfIds);
        console.log(allZaps);
        setZaps((prev) => Object.assign(prev ? prev : {}, allZaps));
    };

    const renderPost = ({ item }) => {
        if (item.type === "image") {
            return (
                <ImagePost
                    item={item}
                    height={height}
                    width={width}
                    user={users[item.pubkey]}
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
                    zapAmount={zapAmount}
                    zaps={zaps ? zaps[item.id] : null}
                />
            );
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            const eventIds = data.map((event) => event.id);
            const toCheck = eventIds.filter(id => !checkedZaps.includes(id))
            loadZaps(toCheck);
            setCheckedZaps((prev) => [...prev, toCheck]);
        }, 1500);
        return () => {
            clearTimeout(timeout);
        };
    }, [data]);

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
                {data.length > 2 && height ? (
                    <View style={{ flex: 1, width: "100%", height: "100%" }}>
                        <FlashList
                            data={sorted}
                            renderItem={renderPost}
                            snapToAlignment="start"
                            decelerationRate="fast"
                            snapToInterval={(height / 100) * 90}
                            estimatedItemSize={(height / 100) * 90}
                            directionalLockEnabled
                            extraData={[users, zapAmount, zaps]}
                            getItemType={(item) => item.type}
                            onEndReached={() => {
                                setNewPage(page + 1);
                            }}
                            onEndReachedThreshold={2}
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
