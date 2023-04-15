import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  SectionList,
} from 'react-native';
import React, { useState } from 'react';
import { useHeaderHeight } from '@react-navigation/elements';
import { globalStyles } from '../../../styles';
import { Input } from '../../../components';
import { useUsersInStore } from '../hooks';
import ResultItem from '../components/ResultItem';
import { TrendingItem } from '../components';

const SearchView = () => {
  const [input, setInput] = useState();
  const result = useUsersInStore(input);
  const headerHeight = useHeaderHeight();
  const data = [
    { title: 'Search Result', data: [{ name: 'Testing stuff' }] },
    { title: 'Known Users', data: result },
  ];

  const renderItem = ({ item, section }) => {
    if (section.title === 'Search Result') {
      return <ResultItem userData={item} />;
    }
    return <ResultItem userData={item} />;
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
    >
      <View>
        <TrendingItem icon="star" title="Trending Users" />
        <TrendingItem icon="reader" title="Trending Posts" />
      </View>
      <Input textInputConfig={{ onChangeText: setInput, value: input }} />
      {result ? (
        <View style={{ width: '100%', flex: 1 }}>
          <SectionList
            sections={data}
            renderItem={renderItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={globalStyles.textBodyBold}>{title}</Text>
            )}
          />
        </View>
      ) : undefined}
    </KeyboardAvoidingView>
  );
};

export default SearchView;
