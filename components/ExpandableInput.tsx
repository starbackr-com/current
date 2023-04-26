import { View, StyleSheet, Pressable, Text, Keyboard } from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Input from './Input';
import { colors, globalStyles } from '../styles';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from './CustomButton';
import pickImageResizeAndUpload from '../utils/images';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    marginBottom: 12
  },
  textBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
});

const ExpandableInput = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const insets = useSafeAreaInsets();
  const { pubKey, walletBearer } = useSelector((state) => state.auth);

  const bottomSheetModalRef = useRef(null);

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackground = (props) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  return (
    <View style={[styles.container]}>
      <View style={styles.textBar}>
        <View>
          <Ionicons
            name="add"
            size={32}
            color={colors.primary500}
            onPress={() => {
              Keyboard.dismiss();
              handlePresentModalPress();
            }}
          />
        </View>
        <View style={{ flex: 1, marginHorizontal: 6, maxHeight: 100 }}>
          <Input
            textInputConfig={{
              placeholder: 'Message...',
              onChangeText: setInput,
              value: input,
              multiline: true
            }}
            inputStyle={{ borderWidth: 0 }}
          />
        </View>
        <View>
          {loading ? <LoadingSpinner size={20}/> : <Ionicons
            name="send"
            size={20}
            color={colors.primary500}
            onPress={async () => {
              setLoading(true);
              await onSubmit(input)
              setLoading(false);
            }}
          />}
        </View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        backgroundStyle={{ backgroundColor: colors.backgroundPrimary }}
        backdropComponent={renderBackground}
      >
        <BottomSheetView onLayout={handleContentLayout}>
          <View style={{ padding: 24, paddingBottom: insets.bottom }}>
            <CustomButton
              text="Image"
              icon="image"
              containerStyles={{ marginVertical: 6 }}
              loading={uploading}
              buttonConfig={{
                onPress: async () => {
                  setUploading(true)
                  const { data } = await pickImageResizeAndUpload(
                    pubKey,
                    walletBearer,
                  );
                  setInput((prev) => prev + `\n ${data}`);
                  setUploading(false);
                  bottomSheetModalRef.current.dismiss();
                },
              }}
            />
            <CustomButton text="GIF" icon="image" />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default ExpandableInput;
