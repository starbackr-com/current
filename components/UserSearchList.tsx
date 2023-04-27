import { View, Text } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { useUsersInStore } from '../hooks';
import UserSearchResultItem from './UserSearchResultItem';

const UserSearchList = ({searchTerm, renderFunction}) => {
  const data = useUsersInStore(searchTerm);

  return (
    <View style={{ width: '100%', flex: 1 }}>
      <FlatList data={data.slice(0,10)} renderItem={renderFunction} />
    </View>
  );
};

export default UserSearchList;
