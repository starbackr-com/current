import { Share, View } from 'react-native';
import React, { forwardRef, useMemo } from 'react';
import * as Clipboard from 'expo-clipboard';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { nip19 } from 'nostr-tools';
import CustomButton from './CustomButton';
import { colors } from '../styles';
import { encodeNoteID } from '../utils';
import { muteUser } from '../utils/users';
import devLog from '../utils/internal';

const PostMenuBottomSheet = forwardRef((props, bottomSheetModalRef) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const muteHandler = async (event) => {
    try {
      await muteUser(event.pubkey);
    } catch (e) {
      devLog(e);
    }
  };

  const reportHandler = (event) => {
    navigation.navigate('ReportPostModal', { event });
  };

  const copyEventHandler = async (id) => {
    const bech32Note = encodeNoteID(id);
    await Clipboard.setStringAsync(bech32Note);
  };

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const renderBackground = (backdropProps) => (
    <BottomSheetBackdrop
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...backdropProps}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
    />
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      backgroundStyle={{ backgroundColor: colors.backgroundPrimary }}
      backdropComponent={renderBackground}
      handleIndicatorStyle={{ backgroundColor: colors.backgroundSecondary }}
    >
      {({ data: event }) => (
        <BottomSheetView onLayout={handleContentLayout}>
          <View style={{ padding: 24, paddingBottom: insets.bottom }}>
            <CustomButton
              text="Copy Event ID"
              icon="clipboard-outline"
              containerStyles={{ marginVertical: 6 }}
              buttonConfig={{
                onPress: () => {
                  bottomSheetModalRef.current.dismiss();
                  copyEventHandler(nip19.noteEncode(event.id));
                },
              }}
            />
            <CustomButton
              text="Report Event"
              icon="alert-circle"
              containerStyles={{ marginVertical: 6 }}
              buttonConfig={{
                onPress: () => {
                  bottomSheetModalRef.current.dismiss();
                  reportHandler(event);
                },
              }}
            />
            <CustomButton
              text="Mute User"
              icon="volume-mute"
              containerStyles={{ marginVertical: 6 }}
              buttonConfig={{
                onPress: async () => {
                  await muteHandler(event);
                  bottomSheetModalRef.current.dismiss();
                },
              }}
            />
            <CustomButton
              text="Share Note"
              icon="share"
              containerStyles={{ marginVertical: 6 }}
              buttonConfig={{
                onPress: async () => {
                  Share.share({
                    message: nip19.noteEncode(event.id),
                    url: `nostr:${nip19.noteEncode(event.id)}`,
                  });
                },
              }}
            />
          </View>
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
});

export default PostMenuBottomSheet;
