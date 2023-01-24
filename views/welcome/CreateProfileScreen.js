import {
    View,
    Text,
    Pressable,
    useWindowDimensions,
    Image,
} from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../styles/colors";
import Input from "../../components/Input";

const CreateProfileScreen = ({ navigation, route }) => {
    const device = useWindowDimensions();
    const image = route.params?.image;
    const pubkey = route.params?.pubkey
    const username = route.params?.username
    return (
        <View style={globalStyles.screenContainer}>
            <Pressable
                style={({ pressed }) => [
                    {
                        width: device.width / 5,
                        height: device.width / 5,
                        borderRadius: device.width / 10,
                        borderWidth: 2,
                        borderColor: colors.primary500,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 32,
                    },
                    pressed ? { backgroundColor: "#222222" } : undefined,
                ]}
                onPress={() => {
                    navigation.navigate("SelectImageScreen", {pubkey: '02547d2ac238e94776af95cf03343d31f007a7306e909462522fff0f5c13724c'});
                }}
            >
                {image ? (
                    <Image
                        source={{ uri: image }}
                        style={{
                            width: device.width / 5,
                            height: device.width / 5,
                            borderRadius: device.width / 10,
                        }}
                    />
                ) : (
                    <Ionicons
                        name="image-outline"
                        size={32}
                        color={colors.primary500}
                    />
                )}
            </Pressable>
            <Text style={[globalStyles.textBodyBold, {marginBottom: 16}]} >{username}</Text>
            <Input label='Bio'/>
        </View>
    );
};

export default CreateProfileScreen;
