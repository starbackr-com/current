import { View } from 'react-native';
import React, { forwardRef, useMemo } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { colors } from '../styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type MenuBottomSheetProps = {
  render: (data) => React.ReactNode;
};

const MenuBottomSheetWithData = React.memo(forwardRef(
(
  { render }: MenuBottomSheetProps,
    ref: React.Ref<BottomSheetModalMethods>,
  ) => {
    const insets = useSafeAreaInsets();

    const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

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
        {({ data }) => (
          <BottomSheetView onLayout={handleContentLayout}>
            <View style={{ padding: 24, paddingBottom: Math.max(insets.bottom, 32) }}>
              {render(data)}
            </View>
          </BottomSheetView>
        )}
      </BottomSheetModal>
    );
  },
));

export default MenuBottomSheetWithData;
