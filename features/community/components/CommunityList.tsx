import { View, Text, Pressable } from 'react-native';
import React, { useLayoutEffect } from 'react';
import useCommunities from '../hooks/useCommunities';
import { FlatList } from 'react-native-gesture-handler';
import CommunityListItem from './CommunityListItem';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles';

const CommunityList = () => {
  const [communitites, setRefresh] = useCommunities();
  const { setOptions } = useNavigation();
  useLayoutEffect(() => {
    setOptions({
      headerRight: () => (
        <Pressable onPress={() => {setRefresh((prev) => prev + 1)}} style={{marginRight: 12}}>
          <Ionicons name="reload" size={15} color={colors.primary500}/>
        </Pressable>
      ),
    });
  }, []);
  const refresh = () => {
    console.log('refreshes!');
  };
  return (
    <View>
      <FlatList
        data={communitites}
        onRefresh={() => {
          console.log('Refresh');
        }}
        renderItem={({ item }) => (
          <CommunityListItem
            groupSlug={item.communitySlug}
            communityObject={item}
          />
        )}
      />
    </View>
  );
};

export default CommunityList;
