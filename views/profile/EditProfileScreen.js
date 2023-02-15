import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyles from "../../styles/globalStyles";
import { ScrollView } from "react-native-gesture-handler";
import Input from "../../components/Input";
import { Image } from "expo-image";
import colors from "../../styles/colors";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useSelector } from "react-redux";
import CustomButton from "../../components/CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getUserData, publishKind0 } from "../../utils/nostrV2";

const uploadImage = async (localUri, pubKey, bearer) => {
    const id = pubKey.slice(0, 16);
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let formData = new FormData();
    formData.append("asset", { uri: localUri, name: filename, type });
    formData.append(
        "name",
        `${id}/profile/avatar_${Math.floor(Math.random() * 100000)}.${match[1]}`
    );
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

const EditProfileScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [newImage, setNewImage] = useState(false);
    const [selected, setSelected] = useState();
    const [name, setName] = useState();
    const [lud16, setLud16] = useState();
    const [nip05, setNip05] = useState();
    const [bio, setBio] = useState();

    const device = useWindowDimensions();

    const bearer = useSelector((state) => state.auth.walletBearer);
    const pk = useSelector((state) => state.auth.pubKey);
    const profiledata = useSelector(state => state.messages.users[pk])
    console.log(profiledata)
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
        setNewImage(true);
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

    const submitHandler = async () => {
        let imageUri = profiledata.picture
        if (newImage) {
            imageUri = await uploadImage(image.uri, pk, bearer);
        }
        publishKind0(nip05, bio, imageUri, lud16, name)
    };

    useEffect(() => {
        setBio(profiledata.about)
        setName(profiledata.name)
        setLud16(profiledata.lud16 || profiledata.lud06)
        setImage(profiledata.picture)
        setNip05(profiledata.nip05)
    }, [])

    return (
        <ScrollView
            style={globalStyles.screenContainerScroll}
            contentContainerStyle={{ alignItems: "center" }}
        >
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
                        marginBottom: 6,
                    },
                    pressed ? { backgroundColor: "#222222" } : undefined,
                ]}
                onPress={pickImage}
            >
                {image ? (
                    <Image
                        source={image.uri || image}
                        style={{
                            width: device.width / 5,
                            height: device.width / 5,
                            borderRadius: device.width / 10,
                            borderWidth: 1,
                            borderColor: colors.primary500,
                        }}
                    />
                ) : (
                    <Ionicons
                        name="images"
                        color={colors.primary500}
                        size={device.width / 16}
                    />
                )}
            </Pressable>
            <Text style={[globalStyles.textBodyS, { marginBottom: 32 }]}>
                Profile Picture
            </Text>
            <View style={{width: '80%', marginBottom: 32}}>
                <Input label="Name" textInputConfig={{value: name, onChangeText: setName}} inputStyle={{marginBottom: 12}}/>
                <Input label="Lightning Address" textInputConfig={{value: lud16, onChangeText: setLud16}} inputStyle={{marginBottom: 12}}/>
                <Input label="NIP05" textInputConfig={{value: nip05, onChangeText: setNip05}} inputStyle={{marginBottom: 12}}/>
                <Input label="Bio" textInputConfig={{multiline: true, value: bio, onChangeText: setBio }} inputStyle={{height: 64}}/>
            </View>
            <View style={{flexDirection: 'row', width: '80%', justifyContent: 'space-evenly'}}>
            <CustomButton
                text="Save"
                buttonConfig={{ onPress: submitHandler }}
            />
            <CustomButton
                text="Back"
                buttonConfig={{
                    onPress: () => {
                        navigation.goBack();
                    },
                }}
                secondary
            />
            </View>
        </ScrollView>
    );
};

export default EditProfileScreen;
