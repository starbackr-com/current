import {
    View,
    Text,
    Pressable,
    useWindowDimensions,
    Image,
    ScrollView,
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
import { SvgCss } from "react-native-svg";
import { followPubkey } from "../../features/userSlice";
import { followUser } from "../../utils/users";

const defaultBio = `This profile was created using current | https://getcurrent.io`;

const CreateProfileScreen = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [bio, setBio] = useState(`This profile was created using current | https://getcurrent.io`);
    const device = useWindowDimensions();
    const dispatch = useDispatch();
    let data;

    const { image, svg, svgId, privKey, address } = route.params;

    if (image) {
        data = (
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
                <Image
                    source={{ uri: image.uri }}
                    style={{
                        width: device.width / 5,
                        height: device.width / 5,
                        borderRadius: device.width / 10,
                    }}
                />
            </Pressable>
        );
    } else if (svg) {
        data = (
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
                <SvgCss
                    xml={svg}
                    width={device.width / 5}
                    height={device.width / 5}
                />
            </Pressable>
        );
    } else {
        data = (
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
                <Ionicons
                    name="image-outline"
                    size={32}
                    color={colors.primary500}
                />
            </Pressable>
        );
    }

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

    const uploadSvg = async (id, bearer) => {
        try {
            const response = await fetch(
                `https://getcurrent.io/avatar?name=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${bearer}`,
                    },
                }
            );
            const data = await response.json();
            if (data.error === true) {
                throw new Error(`Error getting svg-image url: ${data}`)
            };
            return data.data;
        } catch (err) {
            console.log(err)
        }
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
        if (svg) {
            imageUrl = await uploadSvg(svgId, access_token);
        }
        await publishKind0(address, bio, imageUrl);
        followUser(pubKey)
        dispatch(logIn({ bearer: access_token, address, pubKey }));
    };
    return (
        <ScrollView style={globalStyles.screenContainerScroll} contentContainerStyle={{alignItems: 'center'}} keyboardShouldPersistTaps='handled'>
            {data}
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
                    value: bio

                }}
                inputStyle={{ height: "20%" }}
            />
            <CustomButton
                text="Create Profile"
                buttonConfig={{ onPress: createProfileHandler }}
                containerStyles={{ marginTop: 32 }}
            />
        </ScrollView>
    );
};

export default CreateProfileScreen;
