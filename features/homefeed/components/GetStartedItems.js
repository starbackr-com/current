import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../../styles/colors";
import globalStyles from "../../../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setGetStartedItems } from "../../introSlice";
import {getData, storeData} from '../../../utils/cache/asyncStorage'

const ToDoItem = ({ item }) => {
    return (
        <Pressable
            onPress={item.function}
            style={{
                flexDirection: "column",
                width: 100,
                alignItems: "center",
                backgroundColor: colors.backgroundSecondary,
                borderWidth: 1,
                borderColor: colors.primary500,
                padding: 6,
                borderRadius: 10,
            }}
        >
            <Ionicons name={item.icon} color={colors.primary500} />
            <Text style={[globalStyles.textBodyS]}>{item.name}</Text>
        </Pressable>
    );
};

const GetStartedItems = () => {
    const navigation = useNavigation();
    const itemsToShow = useSelector((state) => state.intro.getStartedItems);
    const dispatch = useDispatch();
    const list = [
        {
            id: 0,
            name: "Join beta testers chat!",
            function: async () => {
                Linking.openURL("https://t.me/+1NhSTfdwv1M2MTky");
                dispatch(setGetStartedItems(0));
                const getStartedItemsShown = await getData('getStartedItemsShown')
                if (!getStartedItemsShown) {
                    storeData('getStartedItemsShown', JSON.stringify([0]))
                } else {
                    const array = JSON.parse(getStartedItemsShown)
                    array.push(0)
                    storeData('getStartedItemsShown', JSON.stringify(array))
                }
            },
            icon: "chatbox",
        },
        {
            id: 1,
            name: "Publish your first post",
            function: async () => {
                navigation.navigate('PostView', {
                    screen: 'PostModal',
                    params: {prefilledContent: 'PV nostr! This is my first post, so shoot me a Zap!'},
                  });
                dispatch(setGetStartedItems(1));
                const getStartedItemsShown = await getData('getStartedItemsShown')
                if (!getStartedItemsShown) {
                    storeData('getStartedItemsShown', JSON.stringify([1]))
                } else {
                    const array = JSON.parse(getStartedItemsShown)
                    array.push(1)
                    storeData('getStartedItemsShown', JSON.stringify(array))
                }
            },
            icon: "text",
        },
        {
            id: 2,
            name: "Top up your Wallet",
            function: async () => {
                navigation.navigate("Wallet");
                dispatch(setGetStartedItems(2));
                const getStartedItemsShown = await getData('getStartedItemsShown')
                if (!getStartedItemsShown) {
                    storeData('getStartedItemsShown', JSON.stringify([2]))
                } else {
                    const array = JSON.parse(getStartedItemsShown)
                    array.push(2)
                    storeData('getStartedItemsShown', JSON.stringify(array))
                    console.log(array)
                }
            },
            icon: "logo-bitcoin",
        },
        {
            id: 3,
            name: "Verify Pubkey on Twitter",
            function: async () => {
                navigation.navigate("VerifyTwitterModal");
                dispatch(setGetStartedItems(3));
                const getStartedItemsShown = await getData('getStartedItemsShown')
                if (!getStartedItemsShown) {
                    storeData('getStartedItemsShown', JSON.stringify([3]))
                } else {
                    const array = JSON.parse(getStartedItemsShown)
                    array.push(3)
                    storeData('getStartedItemsShown', JSON.stringify(array))
                    console.log(array)
                }
            },
            icon: "logo-twitter",
        },
    ];

    const listToShow = list.filter((item) => itemsToShow.includes(item.id))
    return (
        <View style={{ width: "100%", borderRadius: 10 }}>
            <FlatList
                horizontal={true}
                data={listToShow}
                renderItem={({ item }) => <ToDoItem item={item} />}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

export default GetStartedItems;
