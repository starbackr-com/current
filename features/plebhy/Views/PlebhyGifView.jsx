import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Input from "../../../components/Input";
import globalStyles from "../../../styles/globalStyles";
import { getUserData } from "../../../utils/nostrV2";
import { Ionicons } from "@expo/vector-icons";
import { MasonryFlashList } from "@shopify/flash-list";
import { GifContainer } from "../components";
import CustomButton from "../../../components/CustomButton";

const PlebhyGifView = ({ navigation, route }) => {
    const [gifs, setGifs] = useState([]);
    const [containerWidth, setContainerWidth] = useState();
    const [input, setInput] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);

    const { opener } = route?.params;

    const getTrendingGifs = async (page) => {
        let plebhyGifs = [];
        const offset = page > 0 ? `&offset=${page * 25}` : "";
        try {
            const plebhyResponse = await fetch(
                `https://getcurrent.io/plebhy?apikey=${process.env.PLEBHY_API_KEY}&search=trending&limit=25&type=gif${offset}`
            );
            const plebhyData = await plebhyResponse.json();
            plebhyGifs = plebhyData.data.map((gif) => ({
                id: gif.sid,
                pTag: gif.ptag,
                eTag: gif.etag,
                thumbnail: decodeURIComponent(gif.images.downsized.url),
                result: decodeURIComponent(gif.images.original.url),
                height: Number(gif.images.downsized.height),
                width: Number(gif.images.downsized.width),
                source: "PLEBHY",
            }));
            const plebhyPubkeys = plebhyData.data.map((gif) => gif.ptag);
            getUserData(plebhyPubkeys);
            setGifs((prev) => [...prev, ...plebhyGifs]);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getTrendingGifs(page);
    }, [page]);

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
                {/* <View
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
                </View> */}
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
                                onEndReached={() => {
                                    setPage((prev) => prev + 1);
                                }}
                                overrideItemLayout={(layout, item) => {layout.size = item.height}}
                                optimizeItemArrangement
                            />
                        </View>
                    ) : undefined}
                </View>
            </View>
        </View>
    );
};

export default PlebhyGifView;
