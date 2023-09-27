import { View, Text } from 'react-native';
import React, { forwardRef, memo, useMemo, useState } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { colors, globalStyles } from '../../../styles';
import { CustomButton, LoadingSpinner } from '../../../components';
import { getMagicText } from '../utils/magicText';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks';
import { replaceText } from '../composeSlice';

const MagicTextSheet = memo(
  forwardRef((_ ,ref: React.RefObject<BottomSheetModalMethods>) => {
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(false);

    const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

    const dispatch = useDispatch();
    const text = useAppSelector((state) => state.compose.text);
    const bearer = useAppSelector((state) => state.auth.walletBearer);

    const {
      animatedHandleHeight,
      animatedSnapPoints,
      animatedContentHeight,
      handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

    const renderBackground = (props) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        backgroundStyle={{ backgroundColor: colors.backgroundPrimary }}
        backdropComponent={renderBackground}
        handleIndicatorStyle={{ backgroundColor: colors.backgroundSecondary }}
      >
        <BottomSheetView onLayout={handleContentLayout}>
          <View
            style={{
              padding: 24,
              paddingBottom: Math.max(insets.bottom, 32),
            }}
          >
            <Text style={globalStyles.textBodyBold}>Magic Text</Text>
            <Text style={globalStyles.textBody}>Choose your desired style</Text>
            {loading ? (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={globalStyles.textBody}>Magic in progress...</Text>
                <LoadingSpinner size={32} />
              </View>
            ) : (
              <View style={{ width: '100%', gap: 4 }}>
                <CustomButton
                  text="Pirate"
                  buttonConfig={{
                    onPress: async () => {
                      setLoading(true);
                      try {
                        const magicText = await getMagicText(
                          bearer,
                          text,
                          'pirate',
                        );
                        dispatch(replaceText(magicText));
                        ref.current.dismiss();
                      } catch (e) {
                        alert(e);
                      } finally {
                        setLoading(false);
                      }
                    },
                  }}
                />
                <CustomButton
                  text="Formal"
                  buttonConfig={{
                    onPress: async () => {
                      setLoading(true);
                      try {
                        const magicText = await getMagicText(
                          bearer,
                          text,
                          'formal',
                        );
                        dispatch(replaceText(magicText));
                        ref.current.dismiss();
                      } catch (e) {
                        alert(e);
                      } finally {
                        setLoading(false);
                      }
                    },
                  }}
                />
                <CustomButton
                  text="Medieval"
                  buttonConfig={{
                    onPress: async () => {
                      setLoading(true);
                      try {
                        const magicText = await getMagicText(
                          bearer,
                          text,
                          'medieval',
                        );
                        dispatch(replaceText(magicText));
                        ref.current.dismiss();
                      } catch (e) {
                        alert(e);
                      } finally {
                        setLoading(false);
                      }
                    },
                  }}
                />
              </View>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }),
);

export default MagicTextSheet;
