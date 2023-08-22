import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles';
import { CustomButton } from '../../../components';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    bottom: 12,
    right: 12,
    position: 'absolute',
    alignItems: 'flex-end',
  },
  mainButton: {
    borderRadius: 10,
    backgroundColor: colors.primary500,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const NewPostButton = () => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const window = useWindowDimensions();
  return (
    <Animated.View style={styles.container}>
      {open ? (
        <Animated.View
          entering={FadeInDown}
          style={{ gap: 12, marginBottom: 12 }}
        >
          <CustomButton
            text="Note"
            icon="pencil"
            containerStyles={{ borderWidth: 1 }}
            buttonConfig={{
              onPress: () => {
                // @ts-ignore
                navigation.navigate('PostView');
                setOpen(false);
              },
            }}
          />
        </Animated.View>
      ) : undefined}
      <Pressable
        style={[
          styles.mainButton,
          {
            height: (window.width / 100) * 12,
            width: (window.width / 100) * 12,
          },
        ]}
        onPress={() => {
          setOpen((prev) => !prev);
        }}
      >
        <Ionicons
          size={(window.width / 100) * 8}
          name={open ? 'close' : 'pencil'}
          color={colors.backgroundPrimary}
        />
      </Pressable>
    </Animated.View>
  );
};

export default NewPostButton;
