/* eslint-disable react/no-unstable-nested-components */
import { View, Text } from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { colors, globalStyles } from '../../../styles';
import {
  CustomButton,
  CustomKeyboardView,
  ExpandableInput,
  MenuBottomSheet,
} from '../../../components';
import { useAgentChat } from '../hooks';
import BackHeaderWithButton from '../../../components/BackHeaderWithButton';
import publishPrompt from '../utils/publishPrompt';
import PromptPaymentButton from '../components/PromptPaymentButton';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import AgentRequest from '../components/AgentRequest';
import AgentTextResponse from '../components/AgentTextResponse';
import { displayModal } from '../../modal/modalSlice';
import AgentImageResponse from '../components/AgentImageResponse';

const AgentChatScreen = ({ navigation, route }) => {
  const { agent } = route?.params || {};

  const [inititalText, setInitialText] = useState();

  const listRef = useRef();
  const suggestionRef = useRef();

  const isPremium = useAppSelector((state) => state.auth.isPremium);
  const ownPk = useAppSelector((state) => state.auth.pubKey);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeaderWithButton
          rightButton={() => (
            <Ionicons
              size={24}
              color={colors.primary500}
              name="information-circle-outline"
              onPress={() => {
                suggestionRef.current.present();
              }}
            />
          )}
          navigation={navigation}
        />
      ),
    });
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
        <ExpandableInput onSubmit={submitJob} initialText={inititalText} />
      </View>
      <MenuBottomSheet ref={suggestionRef}>
        <View style={{ gap: 5, alignItems: 'center' }}>
          <Text style={globalStyles.textH2}>{agent.title}</Text>
          <Image
            source={agent.symbol}
            style={{ height: 70, width: 70, borderRadius: 35 }}
          />
          <Text style={globalStyles.textBodyG}>{agent.placeholder}</Text>
          <Text style={globalStyles.textBody}>
            Sample prompts to get started:
          </Text>
          {agent.examples.map((prompt) => (
            <CustomButton
              text={`${prompt.slice(0, 30)}...`}
              buttonConfig={{
                onPress: () => {
                  setInitialText(prompt);
                  suggestionRef.current.dismiss();
                },
              }}
            />
          ))}
        </View>
      </MenuBottomSheet>
    </CustomKeyboardView>
  );
};

export default AgentChatScreen;
