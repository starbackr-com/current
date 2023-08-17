import { Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles';
import { CustomButton } from '../../../components';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    bottom: 12,
    right: 12,
    position: 'absolute',
    alignItems: 'flex-end'
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary500,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const NewPostButton = () => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  return (
    <Animated.View style={styles.container}>
      {open ? (
        <Animated.View entering={FadeInDown} style={{gap: 12, marginBottom: 12}}>
          <CustomButton text="Note" icon='pencil' containerStyles={{borderWidth: 1}} buttonConfig={{onPress: () => {navigation.navigate('PostView'); setOpen(false);}}}/>
          <CustomButton text="Media" icon='image'containerStyles={{borderWidth: 1}} />
          <CustomButton text="Long Form" icon='book' containerStyles={{borderWidth: 1}}/>
        </Animated.View>
      ) : undefined}
      <Pressable
        style={styles.mainButton}
        onPress={() => {
          setOpen((prev) => !prev);
        }}
      >
        <Ionicons size={32} name={open ? 'close' : 'pencil'} color={colors.backgroundPrimary} />
      </Pressable>
    </Animated.View>
  );
};

export default NewPostButton;
