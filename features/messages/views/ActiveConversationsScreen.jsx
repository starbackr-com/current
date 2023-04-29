import { View, Text, Pressable } from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { FlatList } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { colors, globalStyles } from '../../../styles';
import { CustomButton, Input } from '../../../components';
import useConversations from '../hooks/useConversations';
import { getUserData } from '../../../utils/nostrV2';
import { getValue } from '../../../utils';
import UserSearchList from '../../../components/UserSearchList';
import UserSearchResultItem from '../../../components/UserSearchResultItem';

const timings = [
  { title: 'Last Day', value: 86400 },
  { title: 'Last Week', value: 604800 },
  { title: 'Last Month', value: 2678400 },
  { title: 'All Time', value: 0 },
];

const Conversation = ({ item }) => {
  useEffect(() => {
    getUserData([item]);
  }, []);
  const user = useSelector((state) => state.messages.users[item]) || {};
  const navigation = useNavigation();
  return (
    <Pressable
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.backgroundSecondary,
          padding: 10,
          borderRadius: 6,
          marginTop: 12,
          width: '100%',
        },
        pressed ? { backgroundColor: colors.backgroundActive } : undefined,
      ]}
      onPress={async () => {
        const sk = await getValue('privKey');
        navigation.navigate('Chat', { pk: item, sk });
      }}
    >
      <Image
        source={user.picture || undefined}
        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }}
      />
      <Text style={globalStyles.textBody}>{user.name || item}</Text>
    </Pressable>
  );
};

const ActiveConversationsScreen = () => {
  const [timing, setTiming] = useState({ title: 'Last Week', value: 604800 });
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const activeConversation = useConversations(timing.value);
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef(null);
  const inputRef = useRef(null);

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present('Testing!');
  }, []);

  const renderBackground = (props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  const renderFunction = ({ item }) => <UserSearchResultItem userData={item} />;

  return (
    <View style={[globalStyles.screenContainer, { paddingTop: 12 }]}>
      <View
        style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
      >
        <View style={{ flex: 1 }}>
          <Input
            textInputConfig={{
              onFocus: () => {
                setSearching(true);
              },
              onChangeText: setSearchInput,
              value: searchInput,
              ref: inputRef,
            }}
          />
        </View>
        {searching ? (
          <Text
            style={[globalStyles.textBody, { marginLeft: 12 }]}
            onPress={() => {
              setSearching(false);
              setSearchInput('');
              inputRef.current.blur();
            }}
          >
            Cancel
          </Text>
        ) : undefined}
      </View>
      {searching ? (
        <UserSearchList
          searchTerm={searchInput}
          renderFunction={renderFunction}
        />
      ) : (
        <View style={{ width: '100%' }}>
          <View style={{ width: '100%', flexDirection: 'row', marginTop: 12 }}>
            <CustomButton
              text={`Filter by: ${timing.title}`}
              buttonConfig={{ onPress: handlePresentModalPress }}
            />
            <View style={{ flex: 1 }} />
          </View>
          <FlatList
            data={activeConversation}
            renderItem={({ item }) => <Conversation item={item} />}
            style={{ width: '100%' }}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        backgroundStyle={{ backgroundColor: colors.backgroundPrimary }}
        backdropComponent={renderBackground}
      >
        <BottomSheetView onLayout={handleContentLayout}>
          <View style={{ padding: 24, paddingBottom: insets.bottom }}>
            {timings.map((timing) => (
              <Pressable
                style={({ pressed }) => [
                  {
                    width: '100%',
                    backgroundColor: '#27272a',
                    paddingVertical: 12,
                    borderRadius: 10,
                    marginVertical: 6,
                  },
                  pressed ? { backgroundColor: '#3f3f46' } : undefined,
                ]}
                onPress={() => {
                  setTiming(timing);
                  bottomSheetModalRef.current.dismiss();
                }}
                key={timing.value}
              >
                <Text style={globalStyles.textBody}>{timing.title}</Text>
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default ActiveConversationsScreen;
