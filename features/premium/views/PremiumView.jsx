import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { useDispatch, useSelector } from 'react-redux';
import { colors, globalStyles } from '../../../styles';
import { FeatureCard } from '../components';
import { CustomButton } from '../../../components';
import { setPremium } from '../../authSlice';
import { purchaseSubscription } from '../utils/utils';
import ampedLogo from '../../../assets/amped_placeholder.png';

const styles = StyleSheet.create({
  container: {
    width: '90%',
    gap: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    marginTop: 12,
    alignItems: 'center',
  },
  image: {
    height: 100,
    width: 100,
  },
  subAction: { width: '90%', paddingTop: 24 },
});

const PremiumView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isPremium = useSelector((state) => state.auth.isPremium);
  const dispatch = useDispatch();
  const purchaseHandler = async () => {
    setIsLoading(true);
    await purchaseSubscription();
    setIsLoading(false);
  };
  return (
    <View style={globalStyles.screenContainer}>
      <Image source={ampedLogo} style={styles.image} />
      <View style={styles.container}>
        <FeatureCard icon="notifications" text="Push Notifications" />
        <FeatureCard icon="server" text="Premium Relays" />
        <FeatureCard icon="chatbubble" text="Encrypted Messages" />
        <FeatureCard icon="flash" text="One-Click Zaps" />
        <FeatureCard icon="image" text="HD Media Upload" />
        <FeatureCard icon="at" text="Lightning Address" />
        <FeatureCard icon="save" text="Automatic Event Backups" />
      </View>
      <View style={styles.subAction}>
        <Text style={globalStyles.textBodyS}>Get Amped Up Now!</Text>
        {isPremium ? (
          <Text style={globalStyles.textBodyBold}>Subscription active!</Text>
        ) : (
          <CustomButton
            text="Starting at $3.99"
            containerStyles={{ borderWidth: 1 }}
            disabled={isPremium}
            buttonConfig={{
              onPress: purchaseHandler,
            }}
            loading={isLoading}
          />
        )}
        <CustomButton
          text="Toggle Premium"
          buttonConfig={{
            onPress: () => {
              dispatch(setPremium(!isPremium));
            },
          }}
        />
      </View>
    </View>
  );
};

export default PremiumView;
