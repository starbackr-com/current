import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { colors, globalStyles } from '../../../styles';
import { FeatureCard } from '../components';
import { CustomButton } from '../../../components';
import { purchaseSubscription } from '../utils/utils';
import ampedLogo from '../../../assets/amped_logo.png';

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
    height: 39,
    width: 100,
  },
  subAction: { width: '90%', paddingTop: 24 },
});

const PremiumView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isPremium = useSelector((state) => state.auth.isPremium);
  const purchaseHandler = async () => {
    setIsLoading(true);
    await purchaseSubscription();
    setIsLoading(false);
  };
  return (
    <View style={globalStyles.screenContainer}>
      <Image source={ampedLogo} style={styles.image} contentFit="contain" />
      <View style={styles.container}>
        <FeatureCard icon="star" text="Unlimited PlebAI Access" />
        <FeatureCard icon="notifications" text="Push Notifications" />
        <FeatureCard icon="server" text="Premium Relays" />
        <FeatureCard icon="chatbubble" text="Encrypted Messages" />
        <FeatureCard icon="flash" text="Send & Receive Zaps" />
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
      </View>
    </View>
  );
};

export default PremiumView;
