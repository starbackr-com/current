import { View, Pressable, KeyboardAvoidingView, Platform } from "react-native";
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
import { Event } from "../../utils/nostrV2/Event";
import BackButton from "../../components/BackButton";
import { FlashList } from "@shopify/flash-list";

const Stack = createStackNavigator();

const giphyResponse = {
    type: "gif",
    id: "3o6gDWzmAzrpi5DQU8",
    url: "https://giphy.com/gifs/gq-kim-kardashian-make-it-rain-money-shower-3o6gDWzmAzrpi5DQU8",
    slug: "gq-kim-kardashian-make-it-rain-money-shower-3o6gDWzmAzrpi5DQU8",
    bitly_gif_url: "http://gph.is/28JsJpa",
    bitly_url: "http://gph.is/28JsJpa",
    embed_url: "https://giphy.com/embed/3o6gDWzmAzrpi5DQU8",
    username: "gq",
    source: "http://www.gq.com/story/kim-kardashian-west-kimoji-video",
    title: "Pay Me Kim Kardashian GIF by GQ",
    rating: "g",
    content_url: "",
    source_tld: "www.gq.com",
    source_post_url: "http://www.gq.com/story/kim-kardashian-west-kimoji-video",
    is_sticker: 0,
    import_datetime: "2016-06-20 15:28:15",
    trending_datetime: "2019-04-15 21:45:01",
    images: {
        original: {
            height: "400",
            width: "400",
            size: "996501",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy.gif&ct=g",
            mp4_size: "131450",
            mp4: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy.mp4?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy.mp4&ct=g",
            webp_size: "156856",
            webp: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy.webp?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy.webp&ct=g",
            frames: "17",
            hash: "1c2054da3dcd3eedc2abc701c3bb7bd0",
        },
        downsized: {
            height: "400",
            width: "400",
            size: "996501",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy.gif&ct=g",
        },
        downsized_large: {
            height: "400",
            width: "400",
            size: "996501",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy.gif&ct=g",
        },
        downsized_medium: {
            height: "400",
            width: "400",
            size: "996501",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy.gif&ct=g",
        },
        downsized_small: {
            height: "400",
            width: "400",
            mp4_size: "124999",
            mp4: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy-downsized-small.mp4?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy-downsized-small.mp4&ct=g",
        },
        downsized_still: {
            height: "400",
            width: "400",
            size: "996501",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy_s.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy_s.gif&ct=g",
        },
        fixed_height: {
            height: "200",
            width: "200",
            size: "201926",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200.gif&ct=g",
            mp4_size: "28696",
            mp4: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200.mp4?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200.mp4&ct=g",
            webp_size: "47956",
            webp: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200.webp?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200.webp&ct=g",
        },
        fixed_height_downsampled: {
            height: "200",
            width: "200",
            size: "76114",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200_d.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200_d.gif&ct=g",
            webp_size: "43502",
            webp: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200_d.webp?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200_d.webp&ct=g",
        },
        fixed_height_small: {
            height: "100",
            width: "100",
            size: "71525",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/100.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=100.gif&ct=g",
            mp4_size: "12318",
            mp4: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/100.mp4?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=100.mp4&ct=g",
            webp_size: "21166",
            webp: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/100.webp?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=100.webp&ct=g",
        },
        fixed_height_small_still: {
            height: "100",
            width: "100",
            size: "4855",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/100_s.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=100_s.gif&ct=g",
        },
        fixed_height_still: {
            height: "200",
            width: "200",
            size: "12930",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200_s.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200_s.gif&ct=g",
        },
        fixed_width: {
            height: "200",
            width: "200",
            size: "201926",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200w.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200w.gif&ct=g",
            mp4_size: "28696",
            mp4: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200w.mp4?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200w.mp4&ct=g",
            webp_size: "47956",
            webp: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200w.webp?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200w.webp&ct=g",
        },
        fixed_width_downsampled: {
            height: "200",
            width: "200",
            size: "76114",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200w_d.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200w_d.gif&ct=g",
            webp_size: "43502",
            webp: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200w_d.webp?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200w_d.webp&ct=g",
        },
        fixed_width_small: {
            height: "100",
            width: "100",
            size: "71525",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/100w.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=100w.gif&ct=g",
            mp4_size: "12318",
            mp4: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/100w.mp4?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=100w.mp4&ct=g",
            webp_size: "21166",
            webp: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/100w.webp?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=100w.webp&ct=g",
        },
        fixed_width_small_still: {
            height: "100",
            width: "100",
            size: "4855",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/100w_s.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=100w_s.gif&ct=g",
        },
        fixed_width_still: {
            height: "200",
            width: "200",
            size: "12930",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/200w_s.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=200w_s.gif&ct=g",
        },
        looping: {
            mp4_size: "2135410",
            mp4: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy-loop.mp4?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy-loop.mp4&ct=g",
        },
        original_still: {
            height: "400",
            width: "400",
            size: "76051",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy_s.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy_s.gif&ct=g",
        },
        original_mp4: {
            height: "480",
            width: "480",
            mp4_size: "131450",
            mp4: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy.mp4?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy.mp4&ct=g",
        },
        preview: {
            height: "252",
            width: "252",
            mp4_size: "19267",
            mp4: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy-preview.mp4?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy-preview.mp4&ct=g",
        },
        preview_gif: {
            height: "91",
            width: "91",
            size: "48411",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy-preview.gif?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy-preview.gif&ct=g",
        },
        preview_webp: {
            height: "224",
            width: "224",
            size: "37688",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy-preview.webp?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=giphy-preview.webp&ct=g",
        },
        "480w_still": {
            height: "480",
            width: "480",
            size: "996501",
            url: "https://media3.giphy.com/media/3o6gDWzmAzrpi5DQU8/480w_s.jpg?cid=b39710a73m048jhdr53z52tq9tfuzdce2onwkt2ybvi7ykfw&rid=480w_s.jpg&ct=g",
        },
    },
    user: {
        avatar_url: "https://media1.giphy.com/avatars/gq/8m7sr7vc51Gj.jpg",
        banner_image: "",
        banner_url: "",
        profile_url: "https://giphy.com/gq/",
        username: "gq",
        display_name: "GQ",
        description: "Look Sharp + Live Smart.",
        instagram_url: "",
        website_url: "http://gq.com/",
        is_verified: true,
    },
    analytics_response_payload:
        "e=Z2lmX2lkPTNvNmdEV3ptQXpycGk1RFFVOCZldmVudF90eXBlPUdJRl9UUkVORElORyZjaWQ9YjM5NzEwYTczbTA0OGpoZHI1M3o1MnRxOXRmdXpkY2Uyb253a3QyeWJ2aTd5a2Z3JmN0PWc",
    analytics: {
        onload: {
            url: "https://giphy-analytics.giphy.com/v2/pingback_simple?analytics_response_payload=e%3DZ2lmX2lkPTNvNmdEV3ptQXpycGk1RFFVOCZldmVudF90eXBlPUdJRl9UUkVORElORyZjaWQ9YjM5NzEwYTczbTA0OGpoZHI1M3o1MnRxOXRmdXpkY2Uyb253a3QyeWJ2aTd5a2Z3JmN0PWc&action_type=SEEN",
        },
        onclick: {
            url: "https://giphy-analytics.giphy.com/v2/pingback_simple?analytics_response_payload=e%3DZ2lmX2lkPTNvNmdEV3ptQXpycGk1RFFVOCZldmVudF90eXBlPUdJRl9UUkVORElORyZjaWQ9YjM5NzEwYTczbTA0OGpoZHI1M3o1MnRxOXRmdXpkY2Uyb253a3QyeWJ2aTd5a2Z3JmN0PWc&action_type=CLICK",
        },
        onsent: {
            url: "https://giphy-analytics.giphy.com/v2/pingback_simple?analytics_response_payload=e%3DZ2lmX2lkPTNvNmdEV3ptQXpycGk1RFFVOCZldmVudF90eXBlPUdJRl9UUkVORElORyZjaWQ9YjM5NzEwYTczbTA0OGpoZHI1M3o1MnRxOXRmdXpkY2Uyb253a3QyeWJ2aTd5a2Z3JmN0PWc&action_type=SENT",
        },
    },
};

const PostModal = ({ navigation, route }) => {
    const [content, setContent] = useState();
    const [image, setImage] = useState(null);
    const [sending, setSending] = useState(false);
    const headerHeight = useHeaderHeight();

    const { pubKey, walletBearer } = useSelector((state) => state.auth);

    const expiresAt = route?.params?.expiresAt;
    const gif = route?.params?.gif;
    const prefilledContent = route?.params?.prefilledContent;

    console.log(gif);

    useEffect(() => {
        if (prefilledContent) {
            setContent(prefilledContent);
        }
    }, []);

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
                                    const result = await publishEvent(
                                        postContent
                                    );
                                    if (result.successes.length > 0) {
                                        let newEvent = new Event(result.event);
                                        newEvent.save();
                                        navigation.navigate("MainTabNav");
                                        return;
                                    }
                                    alert("Something went wrong...");
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
    return (
        <View style={[globalStyles.screenContainer]}>
            <Pressable
                style={{
                    width: "100%",
                    backgroundColor: "#222222",
                }}
                onPress={() => {
                    navigation.navigate("PostModal", { gif: 12345 });
                }}
            >
                <GifContainer item={giphyResponse} />
                <FlashList overrideItemLayout/>
            </Pressable>
        </View>
    );
};

const GifContainer = ({ item }) => {
    return (
        <Pressable>
            <Image
                style={{
                    width: 120,
                    height: 120,
                }}
                source={item.images.fixed_height_downsampled.url}
            />
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
            <Stack.Screen
                name="PostGifModal"
                component={PostGifModal}
                options={{ presentation: "transparentModal" }}
            />
        </Stack.Navigator>
    );
};

export default PostView;
