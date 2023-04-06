/* eslint-disable no-shadow */
/* eslint-disable camelcase */
import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { getPublicKey } from 'nostr-tools';
import { useDispatch } from 'react-redux';
import { createWallet, loginToWallet } from '../../../utils/wallet';
import { saveValue } from '../../../utils/secureStore';
import { publishKind0, updateFollowedUsers } from '../../../utils/nostrV2';
import { logIn } from '../../authSlice';
import globalStyles from '../../../styles/globalStyles';
import { LoadingSpinner } from '../../../components';
import { followUser } from '../../../utils/users';
import { generateSeedphrase, mnemonicToSeed } from '../../../utils/keys';

const LoadingProfileScreen = ({ route }) => {
  const { image, svg, svgId, address, bio, isImport, sk, mem } = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    // eslint-disable-next-line
    createProfileHandler();
  });

  const uploadImage = async (pubKey, bearer) => {
    const id = pubKey.slice(0, 16);
    const localUri = image.uri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';
    const formData = new FormData();
    formData.append('asset', { uri: localUri, name: filename, type });
    formData.append('name', `${id}/profile/avatar.${match[1]}`);
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

  const uploadSvg = async (id, bearer) => {
    try {
      const response = await fetch(`${process.env.BASEURL}/avatar?name=${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
      });
      const data = await response.json();
      if (data.error === true) {
        console.log(data);
        throw new Error(`Error getting svg-image url: ${data}`);
      }
      return data.data;
    } catch (err) {
      console.log(err);
    }
    return undefined;
  };
  async function createProfileHandler() {
    let imageUrl;
    if (!isImport) {
      try {
        const mem = generateSeedphrase();
        const sk = mnemonicToSeed(mem);
        const pk = getPublicKey(sk);
        await createWallet(sk, address);
        await saveValue('mem', JSON.stringify(mem));
        await saveValue('privKey', sk);
        await saveValue('address', address);
        const result = await loginToWallet(sk);
        const { access_token, username } = result.data;
        await followUser(pk);
        try {
          if (image) {
            imageUrl = await uploadImage(pk, access_token);
          }
          if (svg) {
            imageUrl = await uploadSvg(svgId, access_token);
          }
          await publishKind0(address, bio, imageUrl, address);
          await updateFollowedUsers();
        } catch (error) {
          console.log(error);
        } finally {
          dispatch(logIn({ bearer: access_token, username, pubKey: pk }));
        }
      } catch (error) {
        console.log(`Failed to create profile: ${error}`);
      }
    } else {
      console.log('importing...');
      const pk = getPublicKey(sk);
      await createWallet(sk, address);
      if (mem) {
        await saveValue('mem', JSON.stringify(mem));
      }
      await saveValue('privKey', sk);
      await saveValue('address', address);
      const result = await loginToWallet(sk);
      const { access_token, username } = result.data;
      await followUser(pk);
      await updateFollowedUsers();
      dispatch(logIn({ bearer: access_token, username, pubKey: pk }));
    }
  }

  return (
    <View
      style={[globalStyles.screenContainer, { justifyContent: 'space-around' }]}
    >
      {isImport ? (
        <Text style={globalStyles.textBody}>Setting up your profile...</Text>
      ) : (
        <Text style={globalStyles.textBody}>Deriving your nostr-keys...</Text>
      )}
      <LoadingSpinner size={100} />
    </View>
  );
};

export default LoadingProfileScreen;
