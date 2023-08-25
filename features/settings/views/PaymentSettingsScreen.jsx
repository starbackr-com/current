/* eslint-disable react/no-unstable-nested-components */
import { View, Text } from 'react-native';
import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';
import { CustomButton, CustomKeyboardView, Input } from '../../../components';
import { colors, globalStyles } from '../../../styles';
import { storeData } from '../../../utils/cache/asyncStorage';
import { setZapAmount, setZapComment, setZapNoconf } from '../../userSlice';
import MenuBottomSheet from '../../../components/MenuBottomSheet';
import { SweepModal } from '../../wallet/components';
import BackHeaderWithButton from '../../../components/BackHeaderWithButton';

const PaymentSettingsScreen = ({ navigation }) => {
  const { zapAmount, zapComment, zapNoconf } = useSelector(
    (state) => state.user,
  );
  const modalRef = useRef();
  const [zapValueInput, setZapValueInput] = useState();
  const [zapValueComment, setZapValueComment] = useState();
  const [iszapNoconfChecked, setzapNoconfChecked] = useState(false);
  const username = useSelector((state) => state.auth.username);
  const dispatch = useDispatch();

  const submitHandler = async () => {
    try {
      await storeData('zapAmount', zapValueInput);
      const newZapComment = zapValueComment === null || zapValueComment === '' ? `⚡️ by ${username}` : zapValueComment;
      await storeData('zapComment', newZapComment);
      await storeData('zapNoconf', iszapNoconfChecked.toString());
      dispatch(setZapAmount(zapValueInput));
      dispatch(setZapComment(newZapComment));
      dispatch(setZapNoconf(iszapNoconfChecked));
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeaderWithButton
          navigation={navigation}
          rightButton={() => (
            <CustomButton
              text="Save"
              icon="save"
              buttonConfig={{
                onPress: submitHandler,
              }}
            />
          )}
        />
      ),
    });
  }, [submitHandler]);

  useEffect(() => {
    setZapValueInput(zapAmount);
    setZapValueComment(zapComment);
    setzapNoconfChecked(zapNoconf);
  }, []);

  return (
    <CustomKeyboardView>
      <ScrollView
        style={globalStyles.screenContainerScroll}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <Input
          textInputConfig={{
            value: zapValueInput,
            onChangeText: setZapValueInput,
            inputMode: 'numeric',
            marginTop: 20,
            marginBottom: 20,
          }}
          label="Default Zap Value"
        />
        <Input
          style={{ marginTop: 32 }}
          textInputConfig={{
            placeholderTextColor: colors.primary500,
            placeholder: `⚡️ by ${username}`,
            value: zapValueComment,
            multiline: true,
            onChangeText: setZapValueComment,
            marginTop: 20,
          }}
          label="Zap Comment"
        />
        <View
          style={
            (globalStyles.screenContainer,
            {
              width: '100%',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              marginBottom: 32,
            })
          }
        >
          <Checkbox
            style={(globalStyles.checkbox, { marginTop: 32 })}
            value={iszapNoconfChecked}
            onValueChange={setzapNoconfChecked}
          />
          <Text
            style={
              (globalStyles.textH2, { color: colors.primary500, marginTop: 32 })
            }
          >
            No Zap Confirmation?
          </Text>
        </View>
        <CustomButton
          text="Sweep Account"
          buttonConfig={{
            onPress: () => {
              modalRef.current.present();
            },
          }}
        />
        <MenuBottomSheet ref={modalRef}>
          <SweepModal />
        </MenuBottomSheet>
      </ScrollView>
    </CustomKeyboardView>
  );
};

export default PaymentSettingsScreen;
