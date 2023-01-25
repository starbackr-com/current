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
import CustomButton from "../../components/CustomButton";
import { useState } from "react";
import { createWallet, loginToWallet } from "../../utils/wallet";
import { useDispatch } from "react-redux";
import { publishKind0 } from "../../utils/nostr/publishNotes";
import { getPublicKey } from "nostr-tools";
import { saveValue } from "../../utils/secureStore";
import { logIn } from "../../features/authSlice";

const defaultBio = `This profile was created using current | https://getcurrent.io`;

const CreateProfileScreen = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [bio, setBio] = useState("");
    const device = useWindowDimensions();
    const dispatch = useDispatch();

    const { image, privKey, address } = route.params;

    const uploadImage = async (pubKey, bearer) => {
        const id = pubKey.slice(0, 16);
        let localUri = image.uri;
        let filename = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        let formData = new FormData();
        formData.append("asset", { uri: localUri, name: filename, type });
        formData.append("name", `${id}/profile/avatar.${match[1]}`);
        formData.append("type", "image");
        const response = await fetch(`https://getcurrent.io/upload`, {
            method: "POST",
            body: formData,
            headers: {
                "content-type": "multipart/form-data",
                Authorization: `Bearer ${bearer}`,
            },
        });
        const data = await response.json();
        console.log(data.data);
        return data.data;
    };
    const createProfileHandler = async () => {
        setIsLoading(true);
        let imageUrl;
        const pubKey = await getPublicKey(privKey);
        await createWallet(privKey, address);
        await saveValue("privKey", privKey);
        await saveValue("address", address);
        const { access_token } = await loginToWallet(privKey);
        if (image) {
            imageUrl = await uploadImage(pubKey, access_token);
        }
        publishKind0(address, bio, imageUrl);
        dispatch(logIn({ bearer: access_token, address }));
    };
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
                    navigation.navigate("SelectImageScreen", {
                        privKey,
                        address,
                    });
                }}
            >
                {image ? (
                    <Image
                        source={{ uri: image.uri }}
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
            <Input
                label="Name"
                textInputConfig={{
                    value: address.split("@")[0],
                    editable: false,
                }}
                inputStyle={{ marginBottom: 16 }}
            />
            <Input
                label="Bio"
                textInputConfig={{
                    multiline: true,
                    onChangeText: setBio,
                    defaultValue: defaultBio,
                }}
                inputStyle={{ height: "20%" }}
            />
            <CustomButton
                text="Create Profile"
                buttonConfig={{ onPress: createProfileHandler }}
                containerStyles={{ marginTop: 32 }}
            />
        </View>
    );
};

export default CreateProfileScreen;
