import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHeaderHeight } from '@react-navigation/elements';
import { ScrollView } from 'react-native-gesture-handler';
import { deleteValue, deleteWallet, getValue } from '../../../utils';
import { publishDeleteAccount } from '../../../utils/nostrV2';
import { dbLogout } from '../../../utils/database';
import { removeData } from '../../../utils/cache/asyncStorage';
import { clearStore } from '../../messagesSlice';
import { clearUserStore } from '../../userSlice';
import { logOut } from '../../authSlice';
import { resetAll } from '../../introSlice';
import { colors, globalStyles } from '../../../styles';
import { CustomButton, Input } from '../../../components';

const DeleteAccountScreen = () => {
  const dispatch = useDispatch();
  const [deleteInput, setDeleteInput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const headerHeight = useHeaderHeight();
  const username = useSelector((state) => state.auth.username);

  const submitHandler = async () => {
    try {
      if (deleteInput === 'DELETE') {
        setIsLoading(true);
        const privKey = await getValue('privKey');
        const result = await deleteWallet(privKey, username);
        console.log(result);
        const successess = await publishDeleteAccount();
        if (successess.length > 1) {
          await deleteValue('privKey');
          await deleteValue('username');
          await deleteValue('mem');
          await dbLogout();
          await removeData(['twitterModalShown', 'zapAmount', 'zapComment']);
          dispatch(clearStore());
          dispatch(clearUserStore());
          dispatch(logOut());
          dispatch(resetAll());
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <KeyboardAvoidingView
      style={[globalStyles.screenContainer]}
      keyboardVerticalOffset={headerHeight}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <Text style={globalStyles.textH2}>Delete Account</Text>
        <Input
          textInputConfig={{
            value: deleteInput,
            onChangeText: setDeleteInput,
          }}
          label="Type 'DELETE' to confirm"
        />
        {isLoading ? (
          <ActivityIndicator
            style={{
              container: {
                flex: 1,
                justifyContent: 'center',
              },
            }}
            size={90}
          />
        ) : (
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 6,
            }}
          >
            <Ionicons
              name="warning-outline"
              color={colors.primary500}
              size={32}
            />
            <Text style={globalStyles.textBody}>
              Account deletion event will be pushed to all connected relays. You
              will not be able to login with this key again. Your wallet will be
              wiped out and balance will be set to zero. Please move the balance
              to another wallet before deletion.
            </Text>
          </View>
        )}
        <View style={{ flex: 2, width: '80%' }} />
        <View
          style={{
            width: '100%',
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            marginBottom: 5,
          }}
        >
          <CustomButton
            text="Delete"
            buttonConfig={{ onPress: submitHandler }}
            disabled={!deleteInput === 'DELETE'}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DeleteAccountScreen;
