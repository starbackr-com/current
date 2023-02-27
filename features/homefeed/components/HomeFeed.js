import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { useHomefeed } from "../hooks/useHomefeed";
import ImagePost from "./ImagePost";
import PostItem from "./PostItem";
import { useSelector } from "react-redux";
import {getZaps} from '../../zaps/utils/getZaps'

const HomeFeed = ({ width, height }) => {
    const [checkedZaps, setCheckedZaps] = useState([]);
    const [zaps, setZaps] = useState();

    const zapAmount = useSelector((state) => state.user.zapAmount);
    const users = useSelector((state) => state.messages.users);

    const now = new Date() / 1000;
    const [data, page, setNewPage] = useHomefeed(now);
    const sorted = data.sort((a, b) => b.created_at - a.created_at);

    const loadZaps = async (arrayOfIds) => {
        const allZaps = await getZaps(arrayOfIds);
        setZaps((prev) => Object.assign(prev ? prev : {}, allZaps));
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            const eventIds = data.map((event) => event.id);
            const toCheck = eventIds.filter((id) => !checkedZaps.includes(id));
            loadZaps(toCheck);
            setCheckedZaps((prev) => [...prev, toCheck]);
        }, 1500);
        return () => {
            clearTimeout(timeout);
        };
    }, [data]);

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

    return (
        <>
            {sorted.length > 3 && height ? (
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
        </>
    );
};

export default HomeFeed;
