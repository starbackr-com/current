import { StyleSheet, Pressable, View } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { colors } from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { CustomButton } from '../../../components';
import { useAppDispatch } from '../../../hooks';
import { replaceText } from '../../post/composeSlice';

type AgentImageResponseProps = {
  imageUri: string;
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.backgroundActive,
    borderRadius: 10,
    width: '100%',
    gap: 10,
  },
});

const AgentImageResponse = ({ imageUri }: AgentImageResponseProps) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const createPostHandler = () => {
    dispatch(replaceText(imageUri));
    navigation.navigate('PostView');
  };
  return (
    <Pressable
      style={styles.container}
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width);
      }}
      onPress={() => {
        //@ts-ignore
        navigation.navigate('ImageModal', { imageUri });
      }}
    >
      <Image
        source={imageUri}
        style={{
          width: containerWidth - 24,
          height: containerWidth - 24,
          borderRadius: 10,
        }}
      />

      <CustomButton
        text="Create Post"
        icon="pencil"
        containerStyles={{ flexGrow: 0 }}
        buttonConfig={{ onPress: createPostHandler }}
      />
    </Pressable>
  );
};

export default AgentImageResponse;
