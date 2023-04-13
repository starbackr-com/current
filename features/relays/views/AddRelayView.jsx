import { Alert, View } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { globalStyles } from '../../../styles';
import { CustomButton, Input } from '../../../components';
import { pool } from '../../../utils/nostrV2';
import { addRelay } from '../relaysSlice';

const AddRelayView = () => {
  const [urlInput, setUrlInput] = useState();
  const dispatch = useDispatch();
  const submitHandler = async () => {
    try {
      const relay = await pool.ensureRelay(urlInput);
      if (!relay) {
        throw new Error('Could not connect to relay!');
      }
      dispatch(addRelay([{ url: relay.url, read: true, write: true }]));
    } catch (e) {
      Alert.alert('Something went wrong... Could not add relay.');
    }
  };
  return (
    <View style={[globalStyles.screenContainer, { paddingTop: 6 }]}>
      <ScrollView style={{ width: '100%' }}>
        <Input
          label="Relay URL"
          textInputConfig={{ onChangeText: setUrlInput, autoCapitalize: 'none', autoComplete: 'off', autoCorrect: false }}
        />
        <CustomButton
          text="Add Relay"
          buttonConfig={{ onPress: submitHandler }}
        />
      </ScrollView>
    </View>
  );
};

export default AddRelayView;
