import { View } from "react-native";
import React from "react";
import globalStyles from "../../../styles/globalStyles";
import { FlashList } from "@shopify/flash-list";
import BackButton from "../../../components/BackButton";
import { useNoteMentions } from "../hooks";
import { Mention } from "../components";

const MentionsView = ({ navigation }) => {
    const data = useNoteMentions();
    const renderItem = ({ item }) => {
        return <Mention item={item} />;
    };

    return (
        <View style={globalStyles.screenContainer}>
            <View style={{ width: "100%" }}>
                <BackButton
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
            </View>
            <View style={{ flex: 1, width: "100%" }}>
                <FlashList
                    data={data}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 10 }} />
                    )}
                    estimatedItemSize={100}
                />
            </View>
        </View>
    );
};

export default MentionsView;