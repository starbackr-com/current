/* eslint-disable react/no-unstable-nested-components */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { View, Text, Platform, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { globalStyles } from '../../../styles';
import BackHeaderWithButton from '../../../components/BackHeaderWithButton';
import {
  CustomButton,
  CustomKeyboardView,
  Input,
  MenuBottomSheet,
} from '../../../components';
import useStatus from '../../../hooks/useStatus';
import { publishStatus } from '../utils/publishStatus';
import { setStatus } from '../../messagesSlice';

const timings = [
  { title: '1 Hour', value: 3600 },
  { title: '6 Hours', value: 21600 },
  { title: '1 Day', value: 86400 },
  { title: '1 Week', value: 604800 },
  { title: 'Never', value: 0 },
];

const NewStatusScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const [expiry, setExpiry] = useState({ title: 'Never', value: 0 });

  const { pubKey } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [status] = useStatus(pubKey);

  const modalRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeaderWithButton
          navigation={navigation}
          rightButton={() => (
            <CustomButton
              text="Send"
              icon="send"
              loading={sending}
              buttonConfig={{
                onPress: async () => {
                  setSending(true);
                  try {
                    await publishStatus(
                      content,
                      website.length > 0 ? website : undefined,
                      expiry.value > 0 ? expiry.value : undefined,
                    );
                    dispatch(
                      setStatus({
                        pubkey: pubKey,
                        status: {
                          content,
                          r: website,
                          updatedAt: Math.floor(Date.now() / 1000),
                        },
                      }),
                    );
                    navigation.navigate('MainTabNav');
                  } catch (e) {
                    console.log(e);
                    setSending(false);
                  }
                },
              }}
            />
          )}
        />
      ),
    });
  }, [sending, content, website, expiry, dispatch]);

  if (Platform.OS === 'android') {
    return (
      <View style={globalStyles.screenContainer}>
        <View style={{ flex: 1, width: '100%', gap: 10 }}>
          <View>
            <Input
              label="Status"
              labelStyle={{ textAlign: 'left', width: '100%' }}
              textInputConfig={{
                placeholder: status?.content || '',
                onChangeText: setContent,
              }}
            />
          </View>
          <View>
            <Input
              label="Link"
              labelStyle={{ textAlign: 'left', width: '100%' }}
              textInputConfig={{
                placeholder: 'https://website.com',
                onChangeText: setWebsite,
              }}
            />
          </View>
          <Text
            style={[
              globalStyles.textBody,
              { width: '100%', textAlign: 'left' },
            ]}
          >
            Expiry
          </Text>
          <View style={{ width: '100%', flexDirection: 'row' }}>
            <CustomButton
              text={expiry.title}
              buttonConfig={{
                onPress: () => {
                  Keyboard.dismiss();
                  modalRef.current.present();
                },
              }}
            />
            <View style={{ flex: 1 }} />
          </View>
        </View>
        <MenuBottomSheet ref={modalRef}>
          <View style={{ gap: 10 }}>
            {timings.map((timing) => (
              <CustomButton
                text={timing.title}
                key={timing.value}
                buttonConfig={{
                  onPress: () => {
                    setExpiry(timing);
                    modalRef.current.dismiss();
                  },
                }}
              />
            ))}
          </View>
        </MenuBottomSheet>
      </View>
    );
  }
  return (
    <CustomKeyboardView noBottomBar>
      <View style={globalStyles.screenContainer}>
        <View style={{ flex: 1, width: '100%', gap: 10 }}>
          <View>
            <Input
              label="Status"
              labelStyle={{ textAlign: 'left', width: '100%' }}
              textInputConfig={{
                placeholder: status?.content || '',
                onChangeText: setContent,
              }}
            />
          </View>
          <View>
            <Input
              label="Link"
              labelStyle={{ textAlign: 'left', width: '100%' }}
              textInputConfig={{
                placeholder: 'https://website.com',
                onChangeText: setWebsite,
              }}
            />
          </View>
          <Text
            style={[
              globalStyles.textBody,
              { width: '100%', textAlign: 'left' },
            ]}
          >
            Expiry
          </Text>
          <View style={{ width: '100%', flexDirection: 'row' }}>
            <CustomButton
              text={expiry.title}
              buttonConfig={{
                onPress: () => {
                  Keyboard.dismiss();
                  modalRef.current.present();
                },
              }}
            />
            <View style={{ flex: 1 }} />
          </View>
        </View>
        <MenuBottomSheet ref={modalRef}>
          <View style={{ gap: 10 }}>
            {timings.map((timing) => (
              <CustomButton
                text={timing.title}
                key={timing.value}
                buttonConfig={{
                  onPress: () => {
                    setExpiry(timing);
                    modalRef.current.dismiss();
                  },
                }}
              />
            ))}
          </View>
        </MenuBottomSheet>
      </View>
    </CustomKeyboardView>
  );
};

export default NewStatusScreen;
