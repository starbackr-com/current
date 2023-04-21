import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { MasonryFlashList } from '@shopify/flash-list';
import globalStyles from '../../../styles/globalStyles';
import { getUserData } from '../../../utils/nostrV2';
import { GifContainer } from '../components';
import devLog from '../../../utils/internal';

const PlebhyStickerView = () => {
  const [sticker, setSticker] = useState([]);
  const [containerWidth, setContainerWidth] = useState();
  const [page, setPage] = useState(0);

  //   const { opener } = route?.params;

  const getTrendingStickers = async (currentPage) => {
    let plebhySticker = [];
    const offset = currentPage > 0 ? `&offset=${currentPage * 25}` : '';
    try {
      const plebhyResponse = await fetch(
        `https://getcurrent.io/plebhy?apikey=${process.env.PLEBHY_API_KEY}&search=trending&limit=25&type=sticker${offset}`,
      );
      const plebhyData = await plebhyResponse.json();
      plebhySticker = plebhyData.data.map((item) => ({
        id: item.sid,
        pTag: item.ptag,
        eTag: item.etag,
        thumbnail: decodeURIComponent(item.images.downsized.url),
        result: decodeURIComponent(item.images.original.url),
        height: Number(item.images.downsized.height),
        width: Number(item.images.downsized.width),
        source: 'PLEBHY',
      }));
      const plebhyPubkeys = plebhyData.data.map((item) => item.ptag);
      getUserData(plebhyPubkeys);
      setSticker((prev) => [...prev, ...plebhySticker]);
    } catch (e) {
      devLog(e);
    }
  };

  useEffect(() => {
    getTrendingStickers(page);
  }, [page]);

  const onLayoutView = (e) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={[globalStyles.screenContainer]}>
      <View
        style={{
          width: '100%',
          flex: 1,
          alignItems: 'center',
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
        <View style={{ width: '100%', flex: 1 }} onLayout={onLayoutView}>
          {sticker ? (
            <View style={{ flex: 1 }}>
              <Text style={[globalStyles.textBodyBold, { textAlign: 'left' }]}>
                Trending
              </Text>
              <MasonryFlashList
                numColumns={2}
                data={sticker}
                renderItem={({ item }) => (
                  <GifContainer item={item} width={containerWidth} />
                )}
                estimatedItemSize={180}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                  setPage((prev) => prev + 1);
                }}
                overrideItemLayout={(layout, item) => {
                  // eslint-disable-next-line no-param-reassign
                  layout.size = item.height;
                }}
                optimizeItemArrangement
              />
            </View>
          ) : undefined}
        </View>
      </View>
    </View>
  );
};

export default PlebhyStickerView;
