import { View, Text } from "react-native";
import React from "react";
import globalStyles from "../../styles/globalStyles";
import LoadingSpinner from "../../components/LoadingSpinner";
import { publishKind0 } from "../../utils/nostrV2";
import { useEffect } from "react";
import { getPublicKey } from "nostr-tools";
import { createWallet, loginToWallet } from "../../utils/wallet";
import { saveValue } from "../../utils/secureStore";
import { logIn } from "../../features/authSlice";
import { useDispatch } from "react-redux";
import { followUser } from "../../utils/users";
import { updateFollowedUsers } from "../../utils/nostrV2/getUserData";

const LoadingProfileScreen = ({ route }) => {
    const { image, svg, svgId, privKey, address, bio, publishProfile } =
        route.params;
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(privKey);
        createProfileHandler();
    });

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
                throw new Error(`Error getting svg-image url: ${data}`);
            }
            return data.data;
        } catch (err) {
            console.log(err);
        }
    };
    const createProfileHandler = async () => {
        let imageUrl;
        try {
            const pubKey = await getPublicKey(privKey);
            await createWallet(privKey, address);
            await saveValue("privKey", privKey);
            await saveValue("address", address);
            const result = await loginToWallet(privKey);
            const { access_token } = result;
            await followUser(pubKey);
            try {
                if (publishProfile) {
                    console.log("Publishing...");
                    if (image) {
                        imageUrl = await uploadImage(pubKey, access_token);
                    }
                    if (svg) {
                        imageUrl = await uploadSvg(svgId, access_token);
                    }
                    await publishKind0(address, bio, imageUrl);
                }
                await updateFollowedUsers();
            } catch (error) {
            } finally {
                dispatch(logIn({ bearer: access_token, address, pubKey }));
            }
        } catch (error) {
            console.log(`Failed to create profile: ${error}`);
        }
    };
    return (
        <View
            style={[
                globalStyles.screenContainer,
                { justifyContent: "space-around" },
            ]}
        >
            <Text style={globalStyles.textBody}>
                Deriving your nostr-keys...
            </Text>
            <LoadingSpinner size={100} />
        </View>
    );
};

export default LoadingProfileScreen;
