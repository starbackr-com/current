import { View, Text, Keyboard, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomButton, Input, LoadingSpinner } from '../../../components';
import { usernameRegex } from '../../../constants';
import globalStyles from '../../../styles/globalStyles';

const UsernameView = ({ navigation, route }) => {
  const [error, setError] = useState(false);
  const [username, setUsername] = useState('');
  const [available, setAvailable] = useState();
  const [isFetching, setIsFetching] = useState();

  const insets = useSafeAreaInsets();

  const { isImport, sk, mem } = route?.params || {};

  const fetchAvailableUsernames = async () => {
    setError(false);
    if (!username.match(usernameRegex)) {
      setError(true);
      return;
    }
    Keyboard.dismiss();
    setIsFetching(true);
    const response = await fetch(
      `${process.env.BASEURL}/checkuser?name=${username}`,
    );
    const data = await response.json();
    setAvailable(data.available);
    setIsFetching(false);
  };

  const nextHandler = (address) => {
    if (isImport) {
      navigation.navigate('Loading', {
        address,
        sk,
        publishProfile: false,
        isImport,
        mem,
      });
      return;
    }
    navigation.navigate('CreateProfile', {
      screen: 'EditProfile',
      params: { address },
    });
  };

  return (
    <View
      style={[
        globalStyles.screenContainer,
        { paddingTop: insets.top + 6, paddingBottom: insets.bottom },
      ]}
    >
      <Text style={[globalStyles.textBodyBold, { textAlign: 'center' }]}>
        Choose your username
      </Text>
      {isImport ? (
        <Text style={globalStyles.textBody}>
          Although you imported an existing key, you still need to choose a
          username for your Current wallet. Your nostr profile will not be
          affected.
        </Text>
      ) : (
        <Text style={globalStyles.textBody}>
          Your username can be used to find you on nostr, but also to receive
          payments on the Lightning Network.
        </Text>
      )}
      <View style={{ width: '100%', alignItems: 'center', margin: 32 }}>
        <View
          style={{
            width: '60%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Input
            textInputConfig={{
              value: username,
              onChangeText: (value) => {
                setUsername(value.toLowerCase());
              },
              autoCapitalize: 'none',
              autoCorrect: false,
              onsubmit: fetchAvailableUsernames,
            }}
          />
          <CustomButton
            icon="search"
            containerStyles={{ marginLeft: 6 }}
            buttonConfig={{ onPress: fetchAvailableUsernames }}
          />
        </View>
      </View>
      {isFetching ? <LoadingSpinner size={50} /> : undefined}
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {available && available.length > 0 && !isFetching && !error ? (
          <Text style={[globalStyles.textBody, { marginBottom: 32 }]}>
            Choose one from the list below
          </Text>
        ) : undefined}
        {available && available.length > 0 && !isFetching && !error
          ? available.map((nip05) => (
            <CustomButton
              key={nip05}
              text={nip05}
              containerStyles={{
                width: '80%',
                marginBottom: 18,
              }}
              buttonConfig={{
                onPress: nextHandler.bind(this, nip05),
              }}
            />
          ))
          : undefined}
        {available && available.length === 0 && !isFetching && !error ? (
          <Text style={globalStyles.textBody}>That username is taken...</Text>
        ) : undefined}
        {error ? (
          <Text style={globalStyles.textBodyError}>
            Usernames must be between 4 and 32 chars and can only contain a-z,
            0-9
          </Text>
        ) : undefined}
      </ScrollView>
    </View>
  );
};

export default UsernameView;
