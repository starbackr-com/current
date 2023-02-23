import { View, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Input from "../../components/Input";
import CustomButton from "../../components/CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHeaderHeight } from "@react-navigation/elements";
import colors from "../../styles/colors";
import globalStyles from "../../styles/globalStyles";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { publishEvent } from "../../utils/nostrV2/publishEvents";
import { Event } from "../../utils/nostrV2/Event";
import BackButton from "../../components/BackButton";

const Stack = createStackNavigator();

const PostModal = ({ navigation, route }) => {
    const [content, setContent] = useState();
    const [image, setImage] = useState(null);
    const [sending, setSending] = useState(false);
    const headerHeight = useHeaderHeight();

    const { pubKey, walletBearer } = useSelector((state) => state.auth);

    const expiresAt = route?.params?.expiresAt;
    const prefilledContent = route?.params?.prefilledContent;
    
    useEffect(() => {
        if (prefilledContent) {
            setContent(prefilledContent)
        }
    },[])

    const resizeImage = async (image) => {
        const manipResult = await manipulateAsync(
            image.localUri || image.uri,
            [{ resize: { width: 1080 } }],
            { compress: 0.5, format: SaveFormat.JPEG }
        );
        setImage(manipResult);
    };

    const uploadImage = async (pubKey, bearer) => {
        const id = pubKey.slice(0, 16);
        let localUri = image.uri;
        let filename = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        let formData = new FormData();
        formData.append("asset", { uri: localUri, name: filename, type });
        formData.append(
            "name",
            `${id}/uploads/image${Math.floor(Math.random() * 10000000)}.${
                match[1]
            }`
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

    const pickImage = async () => {
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

    return (
        <KeyboardAvoidingView
            style={[globalStyles.screenContainer]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={headerHeight}
        >
            <View style={{width: '100%', flexDirection: 'row', marginBottom: 12}}>
            <BackButton onPress={() => {navigation.goBack()}}/>
            </View>
            <Input
                inputStyle={{ flex: 3, maxHeight: "30%" }}
                textInputConfig={{
                    onChangeText: setContent,
                    value: content,
                    multiline: true,
                    placeholder: "What's on your mind?",
                    autoFocus: true,
                }}
            />
            {image ? (
                <View
                    style={{
                        width: "100%",
                        marginVertical: 12,
                        backgroundColor: colors.backgroundSecondary,
                        borderRadius: 10,
                        padding: 6,
                    }}
                >
                    <View style={{ height: 75, width: 75 }}>
                        <Image
                            source={image}
                            style={{ height: 75, width: 75, borderRadius: 10 }}
                        />
                        <Ionicons
                            name="close-circle"
                            color={colors.primary500}
                            size={24}
                            style={{ position: "absolute", right: 0 }}
                            onPress={() => {
                                setImage(null);
                            }}
                        />
                    </View>
                </View>
            ) : undefined}
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                    marginVertical: 12,
                }}
            >
                <View>
                    <CustomButton
                        text="Send"
                        buttonConfig={{
                            onPress: async () => {
                                setSending(true);
                                let postContent = content;
                                try {
                                    if (image) {
                                        let imageURL = await uploadImage(
                                            pubKey,
                                            walletBearer
                                        );
                                        postContent = content.concat(
                                            "\n",
                                            imageURL
                                        );
                                    }
                                    const result = await publishEvent(postContent);
                                    if (result.successes.length > 0) {
                                        let newEvent = new Event(result.event)
                                        newEvent.save()
                                        navigation.navigate('MainTabNav')
                                        return;
                                    }
                                    alert('Something went wrong...')
                                    setSending(false);
                                } catch (e) {
                                    console.log(e);
                                }
                            },
                        }}
                        disabled={!content || content?.length < 1}
                        loading={sending}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        width: "50%",
                    }}
                >
                    <Pressable style={{ marginRight: 24 }} onPress={pickImage}>
                        <Ionicons
                            name="image"
                            color={colors.primary500}
                            size={24}
                        />
                    </Pressable>
                    {/* <Pressable
                        onPress={() => {
                            navigation.navigate("PostExpiryModal");
                        }}
                    >
                        <Ionicons
                            name="time"
                            color={colors.primary500}
                            size={24}
                        />
                    </Pressable> */}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const PostExpiryModal = ({ navigation }) => {
    return (
        <View style={globalStyles.screenContainer}>
            <Pressable
                style={{
                    width: "100%",
                    height: "25%",
                    backgroundColor: "#222222",
                }}
                onPress={() => {
                    navigation.navigate("PostModal", { expiresAt: 12345 });
                }}
            ></Pressable>
        </View>
    );
};

const PostView = ({route}) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PostModal" component={PostModal} />
            <Stack.Screen
                name="PostExpiryModal"
                component={PostExpiryModal}
                options={{ presentation: "transparentModal" }}
            />
        </Stack.Navigator>
    );
};

export default PostView;
