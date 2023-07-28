import { View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { publishEvent } from '../../utils/nostrV2/publishEvents';
import Input from '../../components/Input';
import CustomButton from '../../components/CustomButton';
import BackButton from '../../components/BackButton';
import { colors, globalStyles } from '../../styles';

const Stack = createStackNavigator();

const PostModal = ({ navigation, route }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [sending, setSending] = useState(false);
  const headerHeight = useHeaderHeight();

  const { pubKey, walletBearer, isPremium } = useSelector(
    (state) => state.auth,
  );
  const gif = route?.params?.gif;
  const prefilledContent = route?.params?.prefilledContent;
  useEffect(() => {
    if (prefilledContent) {
      setContent(prefilledContent);
    }
    if (gif) {
      setContent(
        (prev) => `${prev}

${gif}`,
      );
    }
  }, [gif]);

  const resizeImage = async (image) => {
    const manipResult = await manipulateAsync(
      image.localUri || image.uri,
      [{ resize: { width: 1080 } }],
      { compress: 0.5, format: SaveFormat.JPEG },
    );
    setImage(manipResult);
  };

  const uploadImage = async (pubKey, bearer) => {
    const id = pubKey.slice(0, 16);
    let localUri = image.uri;
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let formData = new FormData();
    formData.append('asset', { uri: localUri, name: filename, type });
    formData.append(
      'name',
      `${id}/uploads/image${Math.floor(Math.random() * 10000000)}.${match[1]}`,
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
    console.log(data.data);
    return data.data;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
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
    setSending(true);
    let postContent = content;
    try {
      if (image) {
        let imageURL = await uploadImage(pubKey, walletBearer);
        postContent = content.concat('\n', imageURL);
      }
      await publishEvent(postContent);
      navigation.navigate('MainTabNav');
      return;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[globalStyles.screenContainer]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
    >
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          marginBottom: 12,
        }}
      >
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
      <Input
        inputStyle={{ flex: 3, maxHeight: '30%' }}
        textInputConfig={{
          onChangeText: setContent,
          value: content,
          multiline: true,
          placeholderTextColor: colors.primary500,
          placeholder: "What's on your mind?",
          autoFocus: true,
        }}
      />
      {image ? (
        <View
          style={{
            width: '100%',
            marginVertical: 12,
            backgroundColor: colors.backgroundSecondary,
            borderRadius: 10,
            padding: 6,
          }}
        >
          <View style={{ height: 75, width: 75 }}>
            <Image
              source={image}
              style={{ height: 75, width: 75, borderRadius: 10 }}
            />
            <Ionicons
              name="close-circle"
              color={colors.primary500}
              size={24}
              style={{ position: 'absolute', right: 0 }}
              onPress={() => {
                setImage(null);
              }}
            />
          </View>
        </View>
      ) : undefined}
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          flexDirection: 'row-reverse',
          marginVertical: 12,
          alignItems: 'center',
        }}
      >
        <View>
          <CustomButton
            text="Send"
            buttonConfig={{
              onPress: submitHandler,
            }}
            disabled={!content || content?.length < 1}
            loading={sending}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '50%',
            marginLeft: 12,
          }}
        >
          {isPremium ? (
            <Pressable style={{ marginRight: 24 }} onPress={pickImage}>
              <Ionicons name="image" color={colors.primary500} size={24} />
            </Pressable>
          ) : undefined}
          <Pressable
            onPress={() => {
              navigation.navigate('PlebhyModal', {
                opener: 'PostModal',
              });
            }}
          >
            <MaterialCommunityIcons
              name="file-gif-box"
              color={colors.primary500}
              size={24}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const PostView = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PostModal" component={PostModal} />
    </Stack.Navigator>
  );
};

export default PostView;
