import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';
import Input from '../../components/Input';
import { getUserData, publishKind0 } from '../../utils/nostrV2';
import { colors, globalStyles } from '../../styles';
import { BadgeBar } from '../../features/badges';

const uploadImage = async (localUri, pubKey, bearer) => {
  const id = pubKey.slice(0, 16);
  const filename = localUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image';
  const formData = new FormData();
  formData.append('asset', { uri: localUri, name: filename, type });
  formData.append(
    'name',
    `${id}/profile/avatar_${Math.floor(Math.random() * 100000)}.${match[1]}`,
  );
  formData.append('type', 'image');
  const response = await fetch(`${process.env.BASEURL}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `Bearer ${bearer}`,
    },
  });
  const data = await response.json();
  return data.data;
};

const EditProfileScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(false);
  const [viewHeight, setViewHeight] = useState(0);
  const [, setSelected] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState();
  const [lud16, setLud16] = useState();
  const [nip05, setNip05] = useState();
  const [bio, setBio] = useState();

  const device = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const bearer = useSelector((state) => state.auth.walletBearer);
  const pk = useSelector((state) => state.auth.pubKey);
  const profiledata = useSelector((state) => state.messages.users[pk]);
  const badges = useSelector((state) => state.messages.userBadges[pk]);
  const { badgeDefinitions = [] } = badges || {};

  const resizeImage = async (imageObj) => {
    const manipResult = await manipulateAsync(
      imageObj.localUri || imageObj.uri,
      [{ resize: { width: 400 } }],
      { compress: 1, format: SaveFormat.PNG },
    );
    setImage(manipResult);
  };
  const pickImage = async () => {
    setSelected(null);
    setNewImage(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      resizeImage(result.assets[0]);
    }
  };

  const submitHandler = async () => {
    setIsLoading(true);
    try {
      let imageUri = profiledata?.picture;
      if (newImage) {
        imageUri = await uploadImage(image.uri, pk, bearer);
      }
      const successes = await publishKind0(nip05, bio, imageUri, lud16, name);
      await getUserData(pk);
      setIsLoading(false);
      if (successes.length > 1) {
        Alert.alert(
          'Profile Updated!',
          `Your profile was updated on ${successes.length} relays!`,
          [
            {
              text: 'Okay!',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabNav' }],
                });
              },
            },
          ],
        );
      } else {
        alert('There was a problem updating your profile...');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setBio(profiledata?.about);
    setName(profiledata?.name);
    setLud16(profiledata?.lud16 || profiledata?.lud06);
    setImage(profiledata?.picture);
    setNip05(profiledata?.nip05);
  }, []);

  return (
    <View
      style={globalStyles.screenContainer}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setViewHeight(height);
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={device.height - viewHeight}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            style={globalStyles.screenContainerScroll}
            contentContainerStyle={{ alignItems: 'center' }}
          >
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
                  marginBottom: 12,
                },
                pressed ? { backgroundColor: '#222222' } : undefined,
              ]}
              onPress={pickImage}
            >
              {image ? (
                <Image
                  source={image.uri || image}
                  style={{
                    width: device.width / 5,
                    height: device.width / 5,
                    borderRadius: device.width / 10,
                    borderWidth: 1,
                    borderColor: colors.primary500,
                  }}
                />
              ) : (
                <Ionicons
                  name="images"
                  color={colors.primary500}
                  size={device.width / 16}
                />
              )}
            </Pressable>
            <BadgeBar badgeDefinition={badgeDefinitions} edit />
            <Text style={[globalStyles.textBodyS, { marginBottom: 12 }]}>
              Profile Badges
            </Text>
            <View style={{ width: '80%', marginBottom: 32 }}>
              <Input
                label="Name"
                textInputConfig={{ value: name, onChangeText: setName }}
                inputStyle={{ marginBottom: 12 }}
              />
              <Input
                label="Lightning Address"
                textInputConfig={{ value: lud16, onChangeText: setLud16 }}
                inputStyle={{ marginBottom: 12 }}
              />
              <Input
                label="NIP05"
                textInputConfig={{ value: nip05, onChangeText: setNip05 }}
                inputStyle={{ marginBottom: 12 }}
              />
              <Input
                label="Bio"
                textInputConfig={{
                  multiline: true,
                  value: bio,
                  onChangeText: setBio,
                }}
                inputStyle={{ height: 64 }}
              />
            </View>
            <CustomButton
              text="Save"
              buttonConfig={{ onPress: submitHandler }}
              loading={isLoading}
            />
            <View style={{ height: insets.bottom }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfileScreen;
