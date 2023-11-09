import { Text, View } from 'react-native';
import React, { forwardRef, memo, useMemo } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { colors, globalStyles } from '../../../styles';
import { CustomButton } from '../../../components';
import { useNavigation } from '@react-navigation/native';

const AmpedRequiredModal = memo(
  forwardRef((_, ref: React.RefObject<BottomSheetModalMethods>) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

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
        <BottomSheetView onLayout={handleContentLayout}>
          <View
            style={{
              padding: 24,
              paddingBottom: Math.max(insets.bottom, 32),
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Text style={[globalStyles.textH2, { marginBottom: 0 }]}>
              Get amped up!
            </Text>
            <Text style={globalStyles.textBody}>
              In order to use this feature you need an active Amped Subscription
            </Text>
            <CustomButton
              text="Discover Amped"
              icon="flash"
              buttonConfig={{
                onPress: () => {
                  //@ts-ignore
                  navigation.navigate('Settings', { screen: 'Premium', initial: false });
                  ref.current.dismiss();
                },
              }}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }),
);

export default AmpedRequiredModal;
