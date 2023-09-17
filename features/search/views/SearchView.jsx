import { View, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { nip19 } from 'nostr-tools';
import { FlatList } from 'react-native-gesture-handler';
import { colors, globalStyles } from '../../../styles';
import { CustomButton, CustomKeyboardView, Input } from '../../../components';
import { useUsersInStore } from '../hooks';
import ResultItem from '../components/ResultItem';
import { TrendingItem } from '../components';
import { bech32Regex } from '../../../constants';

const SearchView = ({ navigation }) => {
  const [input, setInput] = useState();
  const [search, setSearch] = useState();
  const [result, setResult] = useState();
  const [searching, setSearching] = useState(false);

  const inputRef = useRef();

  const storedData = useUsersInStore(search);

  useEffect(() => {
    setResult();
    if (input && input.match(bech32Regex)) {
      setResult(input);
      setSearch('');
      return undefined;
    }
    const timer = setTimeout(() => {
      setSearch(input);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  const renderItem = ({ item }) => <ResultItem userData={item} />;

  let searchResult;
  if (search && input && storedData.length !== 0) {
    searchResult = (
      <View style={{ width: '100%', flex: 1 }}>
        <FlatList
          data={storedData}
          renderItem={renderItem}
          ListHeaderComponent={(
            <Text style={[globalStyles.textBodyBold, { textAlign: 'left' }]}>
              Did you mean?
            </Text>
          )}
        />
      </View>
    );
  } else if (search && input && storedData.length === 0) {
    searchResult = (
      <View style={{ width: '100%', flex: 1 }}>
        <Text style={globalStyles.textBody}>No user found...</Text>
      </View>
    );
  } else if (result && input) {
    searchResult = (
      <View>
        <CustomButton
          text={`Go to profile ${input}`}
          buttonConfig={{
            onPress: () => {
              const { data } = nip19.decode(input);
              navigation.navigate('Profile', {
                screen: 'ProfileScreen',
                params: {
                  pubkey: data,
                },
              });
            },
          }}
        />
      </View>
    );
  }

  return (
    <CustomKeyboardView>
      <View style={globalStyles.screenContainer}>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <TrendingItem icon="star" title="Trending Profiles" />
          <TrendingItem icon="reader" title="Trending Posts" />
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Input
              textInputConfig={{
                onFocus: () => {
                  setSearching(true);
                },
                onChangeText: setInput,
                placeholderTextColor: colors.backgroundActive,
                placeholder: 'Search...',
                ref: inputRef,
                value: input,
              }}
            />
          </View>
          {searching ? (
            <Text
              style={[globalStyles.textBody, { marginLeft: 12 }]}
              onPress={() => {
                setInput('');
                inputRef.current.blur();
                setSearching(false);
              }}
            >
              Cancel
            </Text>
          ) : undefined}
        </View>
        {searchResult}
      </View>
    </CustomKeyboardView>
  );
};

export default SearchView;
