import { View, Text } from "react-native";
import React from "react";
import globalStyles from "../../../styles/globalStyles";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "../../../components/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const ReadMoreModal = ({ navigation,route }) => {
    const insets = useSafeAreaInsets();

    const { content } = route.params;
    return (
        <View style={[globalStyles.screenContainer, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
            <ScrollView>
                <Text style={globalStyles.textBody}>{content}</Text>
            </ScrollView>
            <CustomButton text="Close" buttonConfig={{ onPress: () => {navigation.goBack()} }} />
        </View>
    );
};

export default ReadMoreModal;
