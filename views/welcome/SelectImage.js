import { View, Text, Button, Image } from "react-native";
import React, { useState } from "react";
import globalStyles from "../../styles/globalStyles";
import * as ImagePicker from "expo-image-picker";
import { SvgCss } from "react-native-svg";
import { useEffect } from "react";

const SelectImage = ({ navigation, route }) => {
    const pubkey = route.params?.pubkey;
    const [svgs, setSvgs] = useState();

    const fetchRandomImages = async (pubkey) => {
        const id = pubkey.slice(0, 10);
        const response = await fetch(
            `https://key.getcurrent.io/multiavatar?name=c6318c608d`
        );
        const data = await response.json();
        setSvgs(data);
    };
    useEffect(() => {
        fetchRandomImages(pubkey);
    }, []);
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textH1}>Select an Image</Text>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Button
                    title="Pick an image from camera roll"
                    onPress={pickImage}
                />
                {image && (
                    <Image
                        source={{ uri: image }}
                        style={{ width: 200, height: 200 }}
                    />
                )}
                <Button
                    title="Confirm Choice"
                    onPress={() => {
                        navigation.navigate("CreateProfileScreen", { image });
                    }}
                />
                {svgs && <SvgCss xml={svgs['3']} width={50} height={50} />}
            </View>
        </View>
    );
};

export default SelectImage;
