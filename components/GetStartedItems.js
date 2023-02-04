import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";

const list = [
    {
        name: "item1",
        function: () => {
            console.log("do something!");
        },
    },
];

const toDoItem = () => {};

const GetStartedItems = () => {
    return (
        <View style={{height: '10%', backgroundColor: '#222222', width: '100%', borderRadius: 10, padding: 6}}>
            <FlatList horizontal={true} data={list} renderItem={({item}) => <Text>{item.name}</Text>} />
        </View>
    );
};

export default GetStartedItems;
