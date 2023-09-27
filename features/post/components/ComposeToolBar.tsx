import { View, Text, Pressable, Alert } from 'react-native';
import React, { forwardRef, useState } from 'react';
import {
  pickSingleImage,
  resizeImageSmall,
  uploadJpeg,
} from '../../../utils/images';
import { useAppSelector } from '../../../hooks';
import { useDispatch } from 'react-redux';
import { appendToText, replaceText } from '../composeSlice';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../styles';
import { LoadingSpinner } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

const ComposeToolBar = forwardRef((_, ref: React.RefObject<BottomSheetModalMethods>) => {
  const [uploading, setUploading] = useState(false);
  const { pubKey, walletBearer } = useAppSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const imageHandler = async () => {
    setUploading(true);
    try {
      const pickedImage = await pickSingleImage();
      const manipImage = await resizeImageSmall(pickedImage);
      const imageUrl = await uploadJpeg(manipImage, pubKey, walletBearer);
      dispatch(appendToText(imageUrl))
      setUploading(false);
    } catch (e) {
      setUploading(false);
      console.log(e);
    }
  };

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          marginVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Pressable onPress={imageHandler} disabled={uploading}>
          {!uploading ? (
            <Ionicons name="image" size={24} color={colors.primary500} />
          ) : (
            <LoadingSpinner size={24} />
          )}
        </Pressable>
        <Pressable
          onPress={() => {
            //@ts-ignore
            navigation.navigate('PlebhySelector', { opener: 'PostNote' });
          }}
        >
          <MaterialIcons name="gif" size={24} color={colors.primary500} />
        </Pressable>
        <Pressable
          onPress={() => {
            ref.current.present();
          }}
        >
          <Ionicons name="color-wand" size={24} color={colors.primary500} />
        </Pressable>
      </View>
      <View>
        <Pressable
          onPress={() => {
            Alert.alert('Delete', 'Do you want to delete your text?', [
              {
                text: 'Yes',
                style: 'destructive',
                onPress: () => {
                  dispatch(replaceText(''));
                },
              },
              {
                text: 'No',
              },
            ]);
          }}
          style={{ alignSelf: 'flex-end' }}
        >
          <MaterialIcons name="delete" size={24} color={colors.primary500} />
        </Pressable>
      </View>
    </View>
  );
});

export default ComposeToolBar;
