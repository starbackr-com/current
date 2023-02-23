import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import globalStyles from "../../../styles/globalStyles";
import BackButton from "../../../components/BackButton";
import CustomButton from "../../../components/CustomButton";
import { publishReport } from "../utils/publishReport";

const ReportPostModal = ({ navigation, route }) => {
    const { event } = route.params;
    const [isLoading, setIsLoading] = useState(false);

    const reportHandler = async (reason) => {
        setIsLoading(true)
        try {
            const successes = await publishReport(
                reason,
                event.id,
                event.pubkey
            );
            if (successes.length > 0) {
                Alert.alert(
                    "Report Send!",
                    `Your report was published to ${successes.length} relays!`,
                    [
                        {
                            text: "Okay!",
                            onPress: () => {
                                navigation.goBack();
                            },
                        },
                    ]
                );
            } else {
                alert("There was a problem sending your report...");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false)
        }
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
            <Text style={globalStyles.textBodyBold}>Report Content</Text>
            <Text style={globalStyles.textBodyS}>
                Thank you for taking the time to report bad content. Please
                choose the reason for your report below
            </Text>
            <View style={{ flex: 1, justifyContent: "center", width: "100%" }}>
                <Text style={globalStyles.textBodyS}>This post contains:</Text>
                <CustomButton
                    text="Nudity"
                    buttonConfig={{
                        onPress: reportHandler.bind(this, "nudity"),
                    }}
                    containerStyles={{ marginBottom: 16 }}
                    disabled={isLoading}
                />
                <CustomButton
                    text="Profanity"
                    buttonConfig={{
                        onPress: reportHandler.bind(this, "profanity"),
                    }}
                    containerStyles={{ marginBottom: 16 }}
                    disabled={isLoading}
                />
                <CustomButton
                    text="Illegal Content"
                    buttonConfig={{
                        onPress: reportHandler.bind(this, "illegal"),
                    }}
                    containerStyles={{ marginBottom: 16 }}
                    disabled={isLoading}
                />
                <CustomButton
                    text="Spam"
                    buttonConfig={{ onPress: reportHandler.bind(this, "spam") }}
                    containerStyles={{ marginBottom: 16 }}
                    disabled={isLoading}
                />
                <CustomButton
                    text="Impersonation"
                    buttonConfig={{
                        onPress: reportHandler.bind(this, "impersonation"),
                    }}
                    containerStyles={{ marginBottom: 16 }}
                    disabled={isLoading}
                />
            </View>
        </View>
    );
};

export default ReportPostModal;
