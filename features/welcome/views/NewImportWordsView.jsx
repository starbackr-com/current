import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';
import { CustomButton } from '../../../components';
import MenuBottomSheetWithData from '../../../components/MenuBottomSheetWithData';

const NewImportWordsView = () => {
  const insets = useSafeAreaInsets();
  const [listLength, setListLength] = useState(12);
  const modalRef = useRef();

  const pressHandler = () => {
    modalRef.current.present();
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.bottom}
      style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
    >
      <View>
        <Text style={globalStyles.textBodyS}>Select Seed Phrase Length</Text>
        <CustomButton
          text={`${listLength} Words`}
          buttonConfig={{ onPress: pressHandler }}
        />
      </View>
      <MenuBottomSheetWithData
        ref={modalRef}
        render={() => (
          <View>
            <CustomButton text="12 Words" containerStyles={{marginBottom: 12}} buttonConfig={{onPress: () => {setListLength(12)}}}/>
            <CustomButton text="24 Words" buttonConfig={{onPress: () => {setListLength(24)}}}/>
          </View>
        )}
      ></MenuBottomSheetWithData>
    </KeyboardAvoidingView>
  );
};

export default NewImportWordsView;
