/* eslint-disable react/no-unstable-nested-components */
import { Text, View } from 'react-native';
import React, { useMemo, useRef } from 'react';
import { FlashList } from '@shopify/flash-list';
import { ScrollView } from 'react-native-gesture-handler';
import { colors, globalStyles } from '../../../styles';
import DVMSelectionItem from '../components/DVMSelectionItem';
import { useGetAgentsQuery } from '../api/dvmApi';
import { LoadingSpinner } from '../../../components';
import { excludeSensitiveAgents, sortAgentsByCategory } from '../utils/agents';
import AmpedRequiredModal from '../../premium/components/AmpedRequiredModal';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { displayModal } from '../../modal/modalSlice';

const DvmSelectionScreen = ({ navigation }) => {
  const { data, isLoading } = useGetAgentsQuery();
  const isPremium = useAppSelector((state) => state.auth.isPremium);
  const dispatch = useAppDispatch();

  const categorizedAndFilteredAgents = useMemo(() => {
    if (data) {
      const filteredAgents = excludeSensitiveAgents(data);
      return sortAgentsByCategory(filteredAgents);
    }
    return null;
  }, [data]);

  const subscriptionRef = useRef();
  if (categorizedAndFilteredAgents) {
    return (
      <ScrollView
        style={globalStyles.screenContainerScroll}
        contentContainerStyle={{ gap: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {categorizedAndFilteredAgents.map((category) => (
          <View style={{ flex: 1, width: '100%' }} key={category.category}>
            <Text style={[globalStyles.textBodyBold, { textAlign: 'left' }]}>
              {category.category}
            </Text>
            <FlashList
              data={category.agents}
              horizontal
              estimatedItemSize={100}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <DVMSelectionItem
                  agent={item}
                  text={item.title}
                  icon={item.symbol}
                  color={colors.primary500}
                  onPress={() => {
                    if (!isPremium && item.paid) {
                      dispatch(displayModal({ modalKey: 'subscriptionModal' }));
                      return;
                    }
                    navigation.navigate('AgentChat', { agent: item });
                  }}
                />
              )}
            />
          </View>
        ))}
        <AmpedRequiredModal ref={subscriptionRef} />
        <View style={{ height: 32 }} />
      </ScrollView>
    );
  }
  if (isLoading) {
    return (
      <View style={globalStyles.screenContainer}>
        <LoadingSpinner size={32} />
      </View>
    );
  }
  return (
    <View style={globalStyles.screenContainer}>
      <Text style={globalStyles.textBody}>No Agents found</Text>
    </View>
  );
};

export default DvmSelectionScreen;
