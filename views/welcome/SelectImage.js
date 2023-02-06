import {
    View,
    Text,
    Pressable,
    Image,
    useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import globalStyles from "../../styles/globalStyles";
import * as ImagePicker from "expo-image-picker";
import { SvgCss } from "react-native-svg";
import { useEffect } from "react";
import { getPublicKey } from "nostr-tools";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { FlatList } from "react-native";
import CustomButton from "../../components/CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "../../styles/colors";

const SelectImage = ({ navigation, route }) => {
    const [image, setImage] = useState(null);
    const [svgs, setSvgs] = useState();
    const [selected, setSelected] = useState();
    const device = useWindowDimensions();

    const { privKey, address } = route.params;

    const resizeImage = async (image) => {
        const manipResult = await manipulateAsync(
            image.localUri || image.uri,
            [{ resize: { width: 400 } }],
            { compress: 1, format: SaveFormat.PNG }
        );
        setImage(manipResult);
    };

    const fetchRandomImages = async (pubkey) => {
        const pubKey = getPublicKey(privKey);
        const id = pubKey.slice(0, 10);
        console.log(id);
        const response = await fetch(
            `https://key.getcurrent.io/multiavatar?name=${id}`
        );
        const data = await response.json();
        setSvgs(data);
    };
    useEffect(() => {
        fetchRandomImages();
    }, []);

    const pickImage = async () => {
        setSelected(null);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            resizeImage(result.assets[0]);
        }
    };

    const confirmHandler = async () => {
        if (selected) {
        }
    };

    return (
        <View style={globalStyles.screenContainer}>
            <Text style={globalStyles.textBodyBold}>Select an Image</Text>
            <Text style={globalStyles.textBody}>
                Pick one from your camera roll...
            </Text>
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
                        marginVertical: 16,
                    },
                    pressed ? { backgroundColor: "#222222" } : undefined,
                ]}
                onPress={pickImage}
            >
                {image ? (
                    <Image
                        source={{ uri: image.uri }}
                        style={{
                            width: device.width / 5,
                            height: device.width / 5,
                            borderRadius: device.width / 10,
                            borderColor: colors.primary500,
                            borderWidth: 2,
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
            <Text style={[globalStyles.textBody, { marginBottom: 16 }]}>
                or select a randomly generated one...
            </Text>
            <View
                style={{
                    width: "50%",
                }}
            >
                {svgs ? (
                    <FlatList
                        data={Object.keys(svgs)}
                        columnWrapperStyle={{
                            justifyContent: "space-between",
                        }}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    setImage(null);
                                    setSelected(item);
                                }}
                            >
                                <SvgCss
                                    xml={svgs[item]}
                                    width={device.width / 6}
                                    height={device.width / 6}
                                    style={[
                                        { margin: 6 },
                                        selected === item
                                            ? {
                                                  borderWidth: 2,
                                                  borderColor:
                                                      colors.primary500,
                                                  backgroundColor: "#222222",
                                              }
                                            : undefined,
                                    ]}
                                />
                            </Pressable>
                        )}
                    />
                ) : undefined}
            </View>
            <CustomButton
                text="Confirm Choice"
                buttonConfig={{
                    onPress: () => {
                        navigation.navigate("CreateProfileScreen", {
                            image,
                            privKey,
                            address,
                            svg: selected ? svgs[selected] : undefined,
                            svgId: selected
                        });
                    },
                }}
                disabled={!image && !selected}
            />
        </View>
    );
};

export default SelectImage;
