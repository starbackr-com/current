import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { useHeaderHeight } from '@react-navigation/elements';
import { utils } from 'nostr-tools/';
import { globalStyles } from '../../../styles';
import { CustomButton, Input } from '../../../components';
import { pool } from '../../../utils/nostrV2';
import { addRelay } from '../relaysSlice';

const AddRelayView = ({ navigation, route }) => {
  const [urlInput, setUrlInput] = useState();
  const [canAdd, setCanAdd] = useState(false);
  const dispatch = useDispatch();
  const { headerHeight } = route.params;
  const localHeaderHeight = useHeaderHeight();

  const connectHandler = async () => {
    try {
      const relay = await pool.ensureRelay(urlInput);
      if (!relay) {
        throw new Error('Could not connect to relay!');
      }
      setCanAdd(true);
    } catch (e) {
      Alert.alert('Something went wrong... Could not connect to relay.');
    }
  };

  const addHandler = () => {
    if (canAdd) {
      const normalizedUrl = utils.normalizeURL(urlInput);
      const relayObj = { url: normalizedUrl, read: true, write: true };
      dispatch(addRelay([relayObj]));
      navigation.goBack();
    }
  };
  return (
    <KeyboardAvoidingView
      style={[globalStyles.screenContainer, { paddingTop: 6 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight + localHeaderHeight}
    >
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <View>
          <Input
            label="Relay URL"
            textInputConfig={{
              onChangeText: setUrlInput,
              autoCapitalize: 'none',
              autoComplete: 'off',
              autoCorrect: false,
            }}
          />
        </View>
        <View style={{ paddingBottom: 12 }}>
          <CustomButton
            text="Test Connection"
            buttonConfig={{ onPress: connectHandler }}
            containerStyles={{ marginBottom: 12 }}
          />
          <CustomButton
            text="Add Relay"
            buttonConfig={{ onPress: addHandler }}
            disabled={!canAdd}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddRelayView;
