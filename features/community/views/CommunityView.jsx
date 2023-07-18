import { View, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import { useHeaderHeight } from '@react-navigation/elements';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import useChat from '../hooks/useChat';
import { globalStyles } from '../../../styles';
import { CustomButton, ExpandableInput } from '../../../components';
import MenuBottomSheetWithData from '../../../components/MenuBottomSheetWithData';
import { JoinPrompt, Message, RelayMessage, SentMessage } from '../components';
import { useIsMember } from '../hooks';
import { publishCommunityMessage } from '../utils/nostr';
import CustomKeyboardView from '../../../components/CustomKeyboardView';

const CommunityView = ({ route }) => {
  const { communityObject } = route.params;
  const messages = useChat(communityObject);
  const modalRef = useRef();
  const isMember = useIsMember(communityObject);
  const ownPk = useSelector((state) => state.auth.pubKey);

  useEffect(() => {
    if (!isMember) {
      modalRef.current.present();
    }
  }, []);

  const submitHandler = useCallback(
    async (input) => {
      if (input.length > 0) {
        publishCommunityMessage(input, communityObject.communitySlug);
      }
    },
    [communityObject],
  );

  const headerHeight = useHeaderHeight();

  return (
    <CustomKeyboardView>
      <View style={globalStyles.screenContainer}>
        <View style={{ width: '100%', flex: 1 }}>
          <FlatList
            data={messages}
            renderItem={({ item }) => {
              if (item.pubkey === communityObject.relayKey) {
                return <RelayMessage event={item} />;
              }
              if (item.pubkey === ownPk) {
                return <SentMessage event={item} />;
              }
              return <Message event={item} />;
            }}
            keyExtractor={(item) => item.id}
            style={Platform.OS === 'android' ? { scaleY: -1 } : undefined}
            inverted={Platform.OS === 'ios'}
          />
        </View>
        <View style={{ width: '100%', marginTop: 6 }}>
          {isMember ? (
            <ExpandableInput onSubmit={submitHandler} />
          ) : (
            <CustomButton
              text="Join Group"
              containerStyles={{ marginBottom: 12 }}
              buttonConfig={{
                onPress: () => {
                  modalRef.current.present();
                },
              }}
            />
          )}
        </View>
        <MenuBottomSheetWithData
          render={useCallback(
            () => (
              <JoinPrompt
                communityObject={communityObject}
                onClose={() => {
                  modalRef.current.dismiss();
                }}
              />
            ),
            [communityObject],
          )}
          ref={modalRef}
        />
      </View>
    </CustomKeyboardView>
  );
};

export default CommunityView;
