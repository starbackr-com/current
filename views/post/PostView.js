import {
    View,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Input from "../../components/Input";
import CustomButton from "../../components/CustomButton";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import colors from "../../styles/colors";
import globalStyles from "../../styles/globalStyles";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { publishEvent } from "../../utils/nostrV2/publishEvents";
import BackButton from "../../components/BackButton";
import { MasonryFlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

const PostModal = ({ navigation, route }) => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [sending, setSending] = useState(false);
    const headerHeight = useHeaderHeight();

    const { pubKey, walletBearer } = useSelector((state) => state.auth);

    const expiresAt = route?.params?.expiresAt;
    const gif = route?.params?.gif;
    const prefilledContent = route?.params?.prefilledContent;
    useEffect(() => {
        if (prefilledContent) {
            setContent(prefilledContent);
        }
        if (gif) {
            setContent(
                (prev) => `${prev}

${gif}`
            );
        }
    }, [gif]);

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
        const response = await fetch(`${process.env.BASEURL}/upload`, {
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

    const submitHandler = async () => {
        setSending(true);
        let postContent = content;
        try {
            if (image) {
                let imageURL = await uploadImage(pubKey, walletBearer);
                postContent = content.concat("\n", imageURL);
            }
            await publishEvent(postContent);
            navigation.navigate("MainTabNav");
            return;
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[globalStyles.screenContainer]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={headerHeight}
        >
            <View
                style={{
                    width: "100%",
                    flexDirection: "row",
                    marginBottom: 12,
                }}
            >
                <BackButton
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
            </View>
            <Input
                inputStyle={{ flex: 3, maxHeight: "30%" }}
                textInputConfig={{
                    onChangeText: setContent,
                    value: content,
                    multiline: true,
                    placeholderTextColor: colors.primary500,
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
                    width: "100%",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                    marginVertical: 12,
                    alignItems: "center",
                }}
            >
                <View>
                    <CustomButton
                        text="Send"
                        buttonConfig={{
                            onPress: submitHandler,
                        }}
                        disabled={!content || content?.length < 1}
                        loading={sending}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        width: "50%",
                        marginLeft: 12,
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
                    <Pressable
                        onPress={() => {
                            navigation.navigate("PostGifModal");
                        }}
                    >
                        <MaterialCommunityIcons
                            name="file-gif-box"
                            color={colors.primary500}
                            size={24}
                        />
                    </Pressable>
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
const PostGifModal = ({ navigation }) => {
    const [gifs, setGifs] = useState();
    const [containerWidth, setContainerWidth] = useState();
    const [input, setInput] = useState();
    const [searchTerm, setSearchTerm] = useState("");

    const getTrendingGifs = async () => {
        setSearchTerm(input);
        try {
            if (input?.length > 0) {
                const response = await fetch(
                    encodeURI(
                        `https:/api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&limit=25&q=${input}`
                    )
                );
                const data = await response.json();
                const giphyData = data.data.map((gif) => ({
                    id: gif.id,
                    thumbnail: gif.images.fixed_width_downsampled.url,
                    result: gif.images.downsized_medium.url?.split("?")[0],
                    height: Number(gif.images.fixed_width_downsampled.height),
                    width: Number(gif.images.fixed_width_downsampled.width),
                    source: "GIPHY",
                }));
                setGifs(giphyData);
            } else {
                console.log(input);
                const response = await fetch(
                    `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=25`
                );
                const data = await response.json();
                const giphyData = data.data.map((gif) => ({
                    id: gif.id,
                    thumbnail: gif.images.fixed_width_downsampled.url,
                    result: gif.images.downsized_medium.url?.split("?")[0],
                    height: Number(gif.images.fixed_width_downsampled.height),
                    width: Number(gif.images.fixed_width_downsampled.width),
                    source: "GIPHY",
                }));
                setGifs(giphyData);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getTrendingGifs();
    }, []);

    const onLayoutView = (e) => {
        setContainerWidth(e.nativeEvent.layout.width);
    };

    return (
        <View style={[globalStyles.screenContainer]}>
            <View
                style={{
                    width: "100%",
                    flex: 1,
                    alignItems: "center",
                }}
            >
                <View style={{ width: "100%" }}>
                    <BackButton
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        width: "95%",
                        alignItems: "center",
                        paddingVertical: 12,
                    }}
                >
                    <View style={{ flex: 1, marginRight: 12 }}>
                        <Input
                            textInputConfig={{
                                onChangeText: setInput,
                                onSubmitEditing: getTrendingGifs,
                            }}
                        />
                    </View>
                    <Ionicons
                        name="search"
                        size={24}
                        color={colors.primary500}
                        onPress={getTrendingGifs}
                    />
                </View>
                <View
                    style={{ width: "100%", flex: 1 }}
                    onLayout={onLayoutView}
                >
                    {gifs ? (
                        <View style={{ flex: 1 }}>
                            <Text
                                style={[
                                    globalStyles.textBodyBold,
                                    { textAlign: "left" },
                                ]}
                            >
                                {searchTerm?.length > 0
                                    ? searchTerm
                                    : "Trending"}
                            </Text>
                            <MasonryFlashList
                                numColumns={2}
                                data={gifs}
                                renderItem={({ item }) => (
                                    <GifContainer
                                        item={item}
                                        width={containerWidth}
                                    />
                                )}
                                estimatedItemSize={180}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    ) : undefined}
                </View>
            </View>
        </View>
    );
};

const GifContainer = ({ item, width }) => {
    const navigation = useNavigation();
    return (
        <Pressable
            onPress={() => {
                navigation.navigate("PostModal", { gif: item.result });
            }}
        >
            <Image
                style={{
                    width: width / 2,
                    height: item.height,
                }}
                source={item.thumbnail}
            />
            <View
                style={{
                    position: "absolute",
                    backgroundColor: "white",
                    padding: 3,
                    opacity: 0.8,
                    right: 5,
                    bottom: 5,
                    borderRadius: 2
                }}
            >
                <Text style={[globalStyles.textBodyS, {color: 'black'}]}>{item.source}</Text>
            </View>
        </Pressable>
    );
};

const PostView = ({ route }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PostModal" component={PostModal} />
            <Stack.Screen
                name="PostExpiryModal"
                component={PostExpiryModal}
                options={{ presentation: "transparentModal" }}
            />
            <Stack.Screen name="PostGifModal" component={PostGifModal} />
        </Stack.Navigator>
    );
};

export default PostView;
