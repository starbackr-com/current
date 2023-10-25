/* eslint-disable react/no-unstable-nested-components */
import { View, Text } from 'react-native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { FlatList } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
import AmpedRequiredModal from '../../premium/components/AmpedRequiredModal';
import { useAppSelector } from '../../../hooks';
import AgentRequest from '../components/AgentRequest';
import AgentTextResponse from '../components/AgentTextResponse';

const samplePrompts = [
  {
    title: 'A man with a beard',
    prompt: 'Close up portrait of a man with beard in a worn mech suit',
  },
  {
    title: 'Beautiful futuristic city',
    prompt:
      'Envision a captivating aerial view showcasing a modern futuristic lanscape design',
  },
];

const AgentChatScreen = ({ navigation, route }) => {
  const { agent } = route?.params || {};

  const [inititalText, setInitialText] = useState();

  const listRef = useRef();
  const suggestionRef = useRef();
  const subscriptionModal = useRef();

  const isPremium = useAppSelector((state) => state.auth.isPremium);
  const ownPk = useAppSelector((state) => state.auth.pubKey);

  const subHandler = () => {
    subscriptionModal.current.present();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeaderWithButton
          rightButton={() => (
            <Ionicons
              size={24}
              color={colors.primary500}
              name="help-circle-outline"
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
                  navigation.navigate('Premium');
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
          <PromptPaymentButton invoice={item.data} onSubRequired={subHandler} />
        </View>
      );
    }
    if (item.type === 'image') {
      return (
        <View>
          <Text style={globalStyles.textBody}>Image:</Text>
          <Image style={{ height: 200, width: 200 }} source={item.data} />
        </View>
      );
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
          keyExtractor={(item) => item.id}
          inverted
          ref={listRef}
        />
        <ExpandableInput onSubmit={submitJob} initialText={inititalText} />
      </View>
      <MenuBottomSheet ref={suggestionRef}>
        <View style={{ gap: 5 }}>
          <Text style={globalStyles.textBody}>
            Sample prompts to get started:
          </Text>
          {samplePrompts.map((prompt) => (
            <CustomButton
              text={prompt.title}
              buttonConfig={{
                onPress: () => {
                  setInitialText(prompt.prompt);
                  suggestionRef.current.dismiss();
                },
              }}
            />
          ))}
        </View>
      </MenuBottomSheet>
      <AmpedRequiredModal ref={subscriptionModal} />
    </CustomKeyboardView>
  );
};

export default AgentChatScreen;
