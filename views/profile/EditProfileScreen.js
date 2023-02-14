import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React, { useState } from "react";
import globalStyles from "../../styles/globalStyles";
import { ScrollView } from "react-native-gesture-handler";
import Input from "../../components/Input";
import { Image } from "expo-image";
import colors from "../../styles/colors";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useSelector } from "react-redux";
import CustomButton from '../../components/CustomButton'

const uploadImage = async (localUri, pubKey, bearer) => {
    const id = pubKey.slice(0, 16);
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



const EditProfileScreen = ({navigation}) => {
    const [image, setImage] = useState(null);
    const [newImage, setNewImage] = useState(false); 
    const [selected, setSelected] = useState();

    const device = useWindowDimensions();

    const bearer = useSelector(state => state.auth.walletBearer)
    const pk = useSelector(state => state.auth.pubKey)
    const resizeImage = async (image) => {
        const manipResult = await manipulateAsync(
            image.localUri || image.uri,
            [{ resize: { width: 400 } }],
            { compress: 1, format: SaveFormat.PNG }
        );
        setImage(manipResult);
    };
    const pickImage = async () => {
        setSelected(null);
        setNewImage(true)
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

    const submitHandler = () => {
        if (newImage) {
            uploadImage(image.uri, pk, bearer)    
        }
    };
    
    return (
        <ScrollView style={globalStyles.screenContainerScroll} contentContainerStyle={{alignItems: 'center'}}>
            <Text style={globalStyles.textBodyBold}>Edit your Profile</Text>
            <Pressable
                style={({ pressed }) => [
                    {
                        width: device.width / 5,
                        height: device.width / 5,
                        borderRadius: device.width / 10,
                        borderWidth: 1,
                        borderColor: colors.primary500,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 32,
                    },
                    pressed ? { backgroundColor: "#222222" } : undefined,
                ]}
                onPress={pickImage}
            >
                {image ? <Image
                    source={image.uri}
                    style={{
                        width: device.width / 5,
                        height: device.width / 5,
                        borderRadius: device.width / 10,
                    }}
                /> : <Text>None</Text>}
            </Pressable>
            <Input />
            <Input />
            <Input />
            <CustomButton text='Save' buttonConfig={{onPress: submitHandler}}/>
            <CustomButton text='Back'/>
        </ScrollView>
    );
};

export default EditProfileScreen;
