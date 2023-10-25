import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';
import { colors, globalStyles } from '../../../styles';
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { FeatureCard } from '../components';
import { CustomButton } from '../../../components';

const styles = StyleSheet.create({
  selectionContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderTopColor: colors.primary500,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
  },
  selectionSwitch: {
    flexDirection: 'row',
    borderRadius: 6,
    width: 100,
    borderColor: colors.backgroundSecondary,
    borderWidth: 1,
    gap: 10,
    height: 25,
  },
  switch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  switchActive: {
    backgroundColor: colors.backgroundActive,
  },
  container: {
    width: '90%',
    gap: 16,
    padding: 10,
    borderRadius: 6,
    backgroundColor: colors.backgroundSecondary,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ChooseTierView = () => {
  const [selectedTier, setSelectedTier] = useState(1);
  const translateX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const animatedColorTier1 = useAnimatedStyle(() => ({
    color: interpolateColor(
      translateX.value,
      [50, 0],
      [colors.backgroundActive, colors.primary500],
    ),
  }));
  const animatedColorTier2 = useAnimatedStyle(() => ({
    color: interpolateColor(
      translateX.value,
      [0, 50],
      [colors.backgroundActive, colors.primary500],
    ),
  }));
  return (
    <View style={[globalStyles.screenContainer, { paddingHorizontal: 0 }]}>
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {selectedTier === 1 ? (
          <View style={styles.container}>
            <Text style={[globalStyles.textH2, { marginBottom: 0 }]}>
              Spark
            </Text>
            <Text style={globalStyles.textBodyBold}>$0.99 USD</Text>
            <FeatureCard icon="wallet" text="Integrated Wallet" />
            <FeatureCard icon="flash" text="Send & Receive Zaps" />
            <FeatureCard icon="at" text="Lightning Address" />
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={[globalStyles.textH2, { marginBottom: 0 }]}>
              Surge
            </Text>
            <Text style={globalStyles.textBodyBold}>$3.99 USD</Text>
            <FeatureCard icon="wallet" text="Integrated Wallet" />
            <FeatureCard icon="flash" text="Send & Receive Zaps" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
            <FeatureCard icon="at" text="Lightning Address" />
          </View>
        )}
      </ScrollView>
      <View style={{ width: '100%' }}>
        <View style={styles.selectionContainer}>
          <Animated.Text style={[globalStyles.textBody, animatedColorTier1]}>
            Spark
          </Animated.Text>
          <Pressable
            style={styles.selectionSwitch}
            onPress={() => {
              setSelectedTier((p) => (p === 1 ? 2 : 1));
              translateX.value = withTiming(selectedTier === 2 ? 0 : 50);
            }}
          >
            <Animated.View
              style={[
                {
                  width: 50,
                  height: '100%',
                  borderRadius: 6,
                  backgroundColor: colors.backgroundActive,
                },
                animatedStyle,
              ]}
            />
          </Pressable>
          <Animated.Text style={[globalStyles.textBody, animatedColorTier2]}>
            Surge
          </Animated.Text>
        </View>
        <CustomButton text={selectedTier === 1 ? '$0.99 / mon' : '$3.99 / mon'} containerStyles={{ marginHorizontal: 10, marginBottom: 10 }} />
      </View>
    </View>
  );
};

export default ChooseTierView;
