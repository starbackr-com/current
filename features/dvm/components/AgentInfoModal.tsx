import { View, Text } from 'react-native';
import React, { RefObject, forwardRef } from 'react';
import { CustomButton, MenuBottomSheet } from '../../../components';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Agent } from '../utils/agents';
import { globalStyles } from '../../../styles';
import { Image } from 'expo-image';

type AgentInfoModalProps = {
  agent: Agent;
  suggestionCallback: (string) => void;
};

const AgentInfoModal = forwardRef(
  (
    { agent, suggestionCallback }: AgentInfoModalProps,
    suggestionRef: RefObject<BottomSheetModalMethods>,
  ) => {
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
          {agent.examples.map((prompt) => (
            <CustomButton
              text={`${prompt.slice(0, 30)}...`}
              buttonConfig={{
                onPress: () => {
                  suggestionCallback(prompt);
                  suggestionRef.current.dismiss();
                },
              }}
            />
          ))}
        </View>
      </MenuBottomSheet>
    );
  },
);

export default AgentInfoModal;
