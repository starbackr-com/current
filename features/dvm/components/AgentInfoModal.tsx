import { View, Text, Pressable } from 'react-native';
import React, { RefObject, forwardRef } from 'react';
import {
  CustomButton,
  LoadingSpinner,
  MenuBottomSheet,
} from '../../../components';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Agent } from '../utils/agents';
import { globalStyles } from '../../../styles';
import { Image } from 'expo-image';
import { useGetSamplePromptsQuery } from '../api/dvmApi';

type AgentInfoModalProps = {
  agent: Agent;
  suggestionCallback: (string) => void;
};

const AgentInfoModal = forwardRef(
  (
    { agent, suggestionCallback }: AgentInfoModalProps,
    suggestionRef: RefObject<BottomSheetModalMethods>,
  ) => {
    const { data, isLoading } = useGetSamplePromptsQuery({
      agentId: agent.id,
      limit: 3,
      offset: 0,
    });
    const renderPriceInfo = () => {
      if (agent.paid) {
        return (
          <Text style={globalStyles.textBodyS}>
            {agent.satspay} SATS / request.
          </Text>
        );
      }
      return (
        <Text style={globalStyles.textBodyS}>
          {agent.convocount} requests for free, then {agent.satspay} SATS /
          request
        </Text>
      );
    };
    let samplePrompts;
    if (isLoading) {
      samplePrompts = <LoadingSpinner size={24} />;
    } else if (data && agent.category != 'Image Generation') {
      samplePrompts = data.map((prompt) => (
        <CustomButton
          key={prompt.message_id}
          text={`${prompt.prompt.slice(0, 30)}...`}
          buttonConfig={{
            onPress: () => {
              suggestionCallback(prompt.prompt);
              suggestionRef.current.dismiss();
            },
          }}
        />
      ));
    } else if (data && agent.category === 'Image Generation') {
      samplePrompts = (
        <View style={{ width: '100%', flexDirection: 'row', gap: 10 }}>
          {data.map((prompt) => (
            <Pressable
              onPress={() => {
                suggestionCallback(prompt.prompt);
                suggestionRef.current.dismiss();
              }}
              style={{ flex: 1 }}
            >
              <Image
                source={prompt.response}
                style={{ flex: 1, height: 100, borderRadius: 10 }}
              />
            </Pressable>
          ))}
        </View>
      );
    } else {
      samplePrompts = (
        <Text style={globalStyles.textBodyG}>No Sampleprompts found...</Text>
      );
    }

    return (
      <MenuBottomSheet ref={suggestionRef}>
        <View style={{ gap: 5, alignItems: 'center' }}>
          <Text style={globalStyles.textH2}>{agent.title}</Text>
          <Image
            source={agent.symbol}
            style={{ height: 70, width: 70, borderRadius: 35 }}
          />
          {renderPriceInfo()}
          <Text style={globalStyles.textBodyG}>{agent.placeholder}</Text>
          <Text style={globalStyles.textBody}>
            Sample prompts to get started:
          </Text>
          {samplePrompts}
        </View>
      </MenuBottomSheet>
    );
  },
);

export default AgentInfoModal;
