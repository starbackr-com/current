import { View, Text } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { colors } from "../../styles";

const ZapListModal = ({route}) => {
    const zaps = route?.params?.zaps
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
            <View style={{width: '90%', height:'50%', borderRadius: 10, backgroundColor: colors.backgroundSecondary}}>
                <FlashList data={zaps.zaps} renderItem={({item}) => <Text>{item.amount}</Text>}/>
            </View>
        </View>
    );
};

export default ZapListModal;
