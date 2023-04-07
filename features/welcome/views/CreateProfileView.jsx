import {
  Pressable,
  useWindowDimensions,
  Image,
  ScrollView,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SvgCss } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomButton, Input } from '../../../components';
import { colors, globalStyles } from '../../../styles';

const CreateProfileView = ({ navigation, route }) => {
  const [bio, setBio] = useState();
  const device = useWindowDimensions();
  const insets = useSafeAreaInsets();

  let data;

  const { image, svg, svgId, sk, address, updateData, oldData } = route?.params || {};

  useEffect(() => {
    if (oldData && JSON.parse(oldData?.content)?.about.length > 0) {
      setBio(
        JSON.parse(oldData.content)?.about
        || 'This profile was created using current | https://getcurrent.io',
      );
    }
  }, []);

  if (image) {
    data = (
      <Pressable
        style={({ pressed }) => [
          {
            width: device.width / 5,
            height: device.width / 5,
            borderRadius: device.width / 10,
            borderWidth: 1,
            borderColor: colors.primary500,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          },
          pressed ? { backgroundColor: '#222222' } : undefined,
        ]}
        onPress={() => {
          navigation.navigate('SelectImage', {
            sk,
            address,
          });
        }}
      >
        <Image
          source={{ uri: image.uri }}
          style={{
            width: device.width / 5,
            height: device.width / 5,
            borderRadius: device.width / 10,
          }}
        />
      </Pressable>
    );
  } else if (svg) {
    data = (
      <Pressable
        style={({ pressed }) => [
          {
            width: device.width / 5,
            height: device.width / 5,
            borderRadius: device.width / 10,
            borderWidth: 1,
            borderColor: colors.primary500,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          },
          pressed ? { backgroundColor: '#222222' } : undefined,
        ]}
        onPress={() => {
          navigation.navigate('SelectImage', {
            sk,
            address,
          });
        }}
      >
        <SvgCss xml={svg} width={device.width / 5} height={device.width / 5} />
      </Pressable>
    );
  } else {
    data = (
      <Pressable
        style={({ pressed }) => [
          {
            width: device.width / 5,
            height: device.width / 5,
            borderRadius: device.width / 10,
            borderWidth: 1,
            borderColor: colors.primary500,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          },
          pressed ? { backgroundColor: '#222222' } : undefined,
        ]}
        onPress={() => {
          navigation.navigate('SelectImage', {
            sk,
            address,
          });
        }}
      >
        <Ionicons name="image-outline" size={32} color={colors.primary500} />
      </Pressable>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: colors.backgroundPrimary,
      }}
    >
      <ScrollView
        style={globalStyles.screenContainerScroll}
        contentContainerStyle={{ alignItems: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        {data}
        <Input
          label="Name"
          textInputConfig={{
            value:
              updateData === 'none' || updateData === 'ln'
                ? JSON.parse(oldData.content).name
                : address.split('@')[0],
            editable: false,
          }}
          inputStyle={{ marginBottom: 16, color: colors.primary600 }}
        />
        <Input
          label="Tip Address"
          textInputConfig={{
            value:
              updateData === 'none' || updateData === 'ln'
                ? JSON.parse(oldData.content).lud16 || address
                : address,
            editable: false,
          }}
          inputStyle={{ marginBottom: 16, color: colors.primary600 }}
        />
        <Input
          label="Bio"
          textInputConfig={{
            multiline: true,
            onChangeText: setBio,
            value: bio,
          }}
        />
        <CustomButton
          text="Create Profile"
          buttonConfig={{
            onPress: () => {
              navigation.navigate('Loading', {
                image,
                svg,
                svgId,
                sk,
                address,
                bio,
              });
            },
          }}
          containerStyles={{ marginTop: 32 }}
        />
      </ScrollView>
    </View>
  );
};

export default CreateProfileView;
