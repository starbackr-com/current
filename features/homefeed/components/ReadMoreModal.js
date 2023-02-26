import { View, Text } from "react-native";
import React from "react";
import globalStyles from "../../../styles/globalStyles";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "../../../components/CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../../styles/colors";
import { useParseContent } from "../../../hooks/useParseContent";


const ReadMoreModal = ({ navigation,route }) => {
    const insets = useSafeAreaInsets();
    const { event, author } = route.params;
    const parsedContent = useParseContent(event)
    return (
        <View style={[globalStyles.screenContainer, {paddingTop: insets.top+32, paddingBottom: insets.bottom}]}>
            <ScrollView contentContainerStyle={{justifyContent: 'center'}}>
                <Text style={[globalStyles.textBodyBold, {textAlign: 'left'}]}>{author}</Text>
                <Text style={[globalStyles.textBody, {textAlign: 'left'}]}>{parsedContent}</Text>
            </ScrollView>
            <CustomButton text="Close" buttonConfig={{ onPress: () => {navigation.goBack()} }} />
        </View>
    );
};

export default ReadMoreModal;
