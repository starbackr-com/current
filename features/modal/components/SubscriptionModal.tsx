import { Pressable, Text, View } from 'react-native';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { colors, globalStyles } from '../../../styles';
import { CustomButton } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../hooks';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useDispatch } from 'react-redux';
import { dismissModal } from '../modalSlice';
import { purchaseSubscription } from '../../premium';
import { FeatureCard } from '../../premium/components';
//@ts-ignore
import ampedLogo from '../../../assets/amped_logo.png';
import { Image } from 'expo-image';

const SubscriptionModal = memo(() => {
  const { mounted, data } = useAppSelector(
    (state) => state.modal.subscriptionModal,
  );

  const dispatch = useDispatch();

  const navigation = useNavigation();
  const modalRef = useRef<BottomSheetModalMethods>();

  useEffect(() => {
    if (mounted) {
      modalRef.current.present();
    } else {
      modalRef.current.dismiss();
    }
  }, [mounted, modalRef]);

  const renderBackground = (props) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  const purchaseHandler = async () => {
    await purchaseSubscription();
  };

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing={true}
      backgroundStyle={{ backgroundColor: colors.backgroundPrimary }}
      backdropComponent={renderBackground}
      handleIndicatorStyle={{ backgroundColor: colors.backgroundSecondary }}
      onDismiss={() => {
        dispatch(dismissModal({ modalKey: 'subscriptionModal' }));
      }}
    >
      <BottomSheetView>
        <View
          style={{
            padding: 24,
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Image
            source={ampedLogo}
            style={{
              height: 39,
              width: 100,
            }}
            contentFit="contain"
          />
          <Text style={globalStyles.textBodyS}>
            In order to use this feature you need an active Amped Subscription
          </Text>
          <View>
            <Text style={globalStyles.textBodyBold}>Surge</Text>
            <Text style={globalStyles.textBodyG}>$3.99 / month</Text>
            <View
              style={{
                width: '90%',
                gap: 16,
                padding: 10,
                borderRadius: 6,
                backgroundColor: colors.backgroundSecondary,
                marginTop: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FeatureCard icon="star" text="Unlimited PlebAI Access" />
              <FeatureCard icon="wallet" text="Lightning Wallet" />
              <FeatureCard icon="image" text="HD Media Upload" />
              <FeatureCard icon="server" text="Premium Relays" />
            </View>
          </View>
          <Text
            style={globalStyles.textBodyG}
            onPress={() => {
              modalRef.current.dismiss();
              navigation.navigate('Settings', {
                screen: 'Premium',
                initial: false,
              });
            }}
          >
            And much more!
          </Text>
          <CustomButton
            text="Subscribe $3.99/mon"
            icon="flash"
            buttonConfig={{
              onPress: purchaseHandler,
            }}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default SubscriptionModal;
