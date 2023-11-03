/* eslint-disable react/no-unstable-nested-components */
import { View, Text, Platform } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../../../styles';
import {
  CustomButton,
  CustomKeyboardView,
  StandardInput,
} from '../../../components';
import { useAgentChat } from '../hooks';
import publishPrompt from '../utils/publishPrompt';
import PromptPaymentButton from '../components/PromptPaymentButton';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import AgentRequest from '../components/AgentRequest';
import AgentTextResponse from '../components/AgentTextResponse';
import { displayModal } from '../../modal/modalSlice';
import AgentImageResponse from '../components/AgentImageResponse';
import AgentInfoModal from '../components/AgentInfoModal';
import BackButton from '../../../components/BackButton';
import { agentIntroShown } from '../utils/agents';

const AgentChatScreen = ({ navigation, route }) => {
  const { agent } = route?.params || {};

  const [inititalText, setInitialText] = useState();

  const listRef = useRef();
  const suggestionRef = useRef();

  const isPremium = useAppSelector((state) => state.auth.isPremium);
  const ownPk = useAppSelector((state) => state.auth.pubKey);
  const dispatch = useAppDispatch();

  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={{
            backgroundColor: colors.backgroundPrimary,
            padding: 12,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: Platform.OS === 'android' ? insets.top : 12,
          }}
        >
          {/* @ts-ignore */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <BackButton
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Text style={globalStyles.textBodyBold}>{agent.title}</Text>
          </View>
          <Ionicons
            size={24}
            color={colors.primary500}
            name="information-circle-outline"
            onPress={() => {
              suggestionRef.current.present();
            }}
          />
        </View>
      ),
    });
  }, [suggestionRef]);

  useEffect(() => {
    async function check() {
      const introShown = await agentIntroShown(agent.pubkey);
      if (!introShown) {
        suggestionRef.current.present();
      }
    }
    if (suggestionRef.current) {
      check();
    }
  }, [suggestionRef]);

  const sortedEvents = useAgentChat(agent.pubkey);

  useScrollToTop(listRef);

  const submitJob = (input) => {
    publishPrompt(agent.pubkey, input);
  };

  const renderEvent = ({ item }) => {
    if (item.response.pubkey === ownPk) {
      return <AgentRequest content={item.response.content} />;
    }
    if (item.type === 'text') {
      return <AgentTextResponse content={item.response.content} />;
    }
    if (item.type === 'invoice') {
      if (!isPremium) {
        return (
          <View>
            <Text style={globalStyles.textBodyG}>
              You need an active Amped subscription to continue this
              conversation
            </Text>
            <CustomButton
              text="Get Amped"
              icon="flash"
              buttonConfig={{
                onPress: () => {
                  dispatch(displayModal({ modalKey: 'subscriptionModal' }));
                },
              }}
            />
          </View>
        );
      }
      return (
        <View>
          <Text style={globalStyles.textBodyG}>
            This agent requires a payment to process your last request
          </Text>
          <PromptPaymentButton invoice={item.data} agent={agent} />
        </View>
      );
    }
    if (item.type === 'image') {
      return <AgentImageResponse imageUri={item.data} />;
    }
    return <Text style={globalStyles.textBody}>{item.data}</Text>;
  };

  return (
    <CustomKeyboardView>
      <View
        style={[
          globalStyles.screenContainer,
          {
            paddingTop: 0,
            borderTopColor: colors.backgroundSecondary,
            borderTopWidth: 1,
          },
        ]}
      >
        <FlatList
          data={sortedEvents}
          renderItem={renderEvent}
          contentContainerStyle={{ gap: 12 }}
          style={{ flex: 1, width: '100%' }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.response.id}
          inverted
          ref={listRef}
        />
        <StandardInput onSubmit={submitJob} initialText={inititalText} />
      </View>
      <AgentInfoModal
        agent={agent}
        suggestionCallback={setInitialText}
        ref={suggestionRef}
      />
    </CustomKeyboardView>
  );
};

export default AgentChatScreen;
