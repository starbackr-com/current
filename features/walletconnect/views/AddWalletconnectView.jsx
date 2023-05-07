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

const AddWalletconnectView = ({ navigation, route }) => {
  const [urlInput, setUrlInput] = useState();
  const [canAdd, setCanAdd] = useState(false);
  const dispatch = useDispatch();
  const { headerHeight } = route.params;
  const localHeaderHeight = useHeaderHeight();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const connectHandler = async () => {
    try {
      const relay = await pool.ensureRelay(urlInput);
      console.log('this is the new view');
      if (!relay) {
        throw new Error('Could not connect to relay!');
      }
      setCanAdd(true);
    } catch (e) {
      Alert.alert('Something went wrong... Could not connect to relay.');
    }
  };

  const changeHandler = (amount) => {
      if (amount.length > 0 && name.length > 0) {
          setCanAdd(true);
      }
      const newAmount = amount.replace(",", ".");
      setAmount(newAmount);
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
        <View

        style={{
            flex: 5,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
        }}

        >
        <Input
            textInputConfig={{
                onChangeText: setName,
                placeholder: 'Amethyst App'
            }}
            inputStyle={{ width: "50%", marginBottom: 12 }}
            label="Name"
        />
        <Input
            textInputConfig={{
                autoFocus: true,
                keyboardType: "numeric",
                onChangeText: changeHandler,
                placeholder: 'in SATS'
            }}
            inputStyle={{ width: "50%", marginBottom: 12 }}
            label="Max Amount"
        />

        </View>
        <View style={{ paddingBottom: 12 }}>

          <CustomButton
            text="Add"
            buttonConfig={{ onPress: addHandler }}
            disabled={!canAdd}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddWalletconnectView;
