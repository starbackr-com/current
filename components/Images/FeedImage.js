import { Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";

const FeedImage = ({ size, images }) => {
    const navigation = useNavigation();
    const blurhash =
        "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
    return (
        <Pressable
            style={{ height: size, width: size }}
            onPress={() => {
                navigation.navigate("ImageModal", { imageUri: images });
            }}
        >
            <Image
                source={images[0]}
                style={{ height: size, width: size, padding: 6 }}
                contentFit='cover'
                placeholder={blurhash}
                recyclingkey={images[0]}
            />
        </Pressable>
    );
};

export default FeedImage;
