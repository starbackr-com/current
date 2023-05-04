import { Text, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import devLog from '../../../utils/internal';
import TrendingNote from '../components/TrendingNote';
import { colors, globalStyles } from '../../../styles';
import TrendingImages from '../components/TrendingImages';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomButton } from '../../../components';

const TrendingPostView = () => {
  const [trendingNotes, setTrendingNotes] = useState([]);
  const [error, setError] = useState();

  const bottomSheetModalRef = useRef();

  const insets = useSafeAreaInsets();

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  // callbacks
  const handlePresentModalPress = (data) => {
    console.log(data);
    bottomSheetModalRef.current?.present('Testing!');
  };

  const renderBackground = (props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  useEffect(() => {
    async function getTrendingNotes() {
      try {
        const res = await fetch('https://api.nostr.band/v0/trending/notes');
        if (res.status !== 200) {
          const reqError = new Error('Request failed...');
          setError(reqError.message);
          throw reqError;
        }
        const data = await res.json();
        const trending = data.notes.map((note) => note.event);
        setTrendingNotes(trending);
      } catch (e) {
        setError(e.message);
        devLog(e);
      }
    }
    getTrendingNotes();
  }, []);
  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ flex: 1, width: '100%' }}>
        {!error ? <FlashList
          data={trendingNotes}
          renderItem={({ item }) => <TrendingNote event={item} onMenu={handlePresentModalPress}/>}
          ListHeaderComponent={<TrendingImages />}
          estimatedItemSize={300}
        /> : <Text style={globalStyles.textBodyError}>{error}</Text>}
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        backgroundStyle={{ backgroundColor: colors.backgroundPrimary }}
        backdropComponent={renderBackground}
        handleIndicatorStyle={{backgroundColor: colors.backgroundSecondary}}
      >
        <BottomSheetView onLayout={handleContentLayout}>
          <View style={{ padding: 24, paddingBottom: insets.bottom }}>
            <CustomButton text="Repost Event" icon="repeat" containerStyles={{ marginVertical: 6 }} />
            <CustomButton text="Copy Event ID" icon="clipboard-outline" containerStyles={{ marginVertical: 6 }} />
            <CustomButton text="Report Event" icon="alert-circle" containerStyles={{ marginVertical: 6 }} />
            <CustomButton text="Mute User" icon="volume-mute" containerStyles={{ marginVertical: 6 }} />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default TrendingPostView;
