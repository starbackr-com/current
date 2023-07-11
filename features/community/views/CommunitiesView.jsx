import { Text, View } from 'react-native';
import React, { useRef } from 'react';
import { globalStyles } from '../../../styles';
import CommunityList from '../components/CommunityList';
import { CustomButton } from '../../../components';
import MenuBottomSheet from '../../../components/MenuBottomSheet';

const CommunitiesView = () => {
  const modalRef = useRef();
  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ width: '100%' }}>
        <CustomButton
          text="Relay: wss://spool.chat"
          buttonConfig={{
            onPress: () => {
              modalRef.current.present();
            },
          }}
        />
      </View>
      <CommunityList />
      <MenuBottomSheet ref={modalRef}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Text style={globalStyles.textBody}>
            Switching Relays is not yet supported...
          </Text>
          <CustomButton
            text="Okay"
            buttonConfig={{
              onPress: () => {
                modalRef.current.dismiss();
              },
            }}
          />
        </View>
      </MenuBottomSheet>
    </View>
  );
};

export default CommunitiesView;
