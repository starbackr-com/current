import { View, Text } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import ImagePost from './ImagePost';
import PostItem from './PostItem';
import { usePaginatedFeed } from '../hooks/usePaginatedFeed';
import { colors, globalStyles } from '../../../styles';

const HomeFeed = ({ width, height }) => {
  const [refreshing, setRefreshing] = useState(false);

  const listRef = useRef();

  const zapAmount = useSelector((state) => state.user.zapAmount);
  const users = useSelector((state) => state.messages.users);

  const now = new Date() / 1000;

  const [get25RootPosts, refresh, events] = usePaginatedFeed(now);
  const navigation = useNavigation();
  useScrollToTop(listRef);

  const refreshHandler = useCallback(() => {
    setRefreshing(true);
    refresh();
    setRefreshing(false);
  }, []);

  const renderPost = useCallback(
    ({ item }) => {
      if (item.type === 'image') {
        return (
          <ImagePost
            item={item}
            height={height}
            width={width}
            user={users[item.pubkey]}
            zapAmount={zapAmount}
          />
        );
      }
      return (
        <PostItem
          item={item}
          height={height}
          width={width}
          user={users[item.pubkey]}
          zapAmount={zapAmount}
        />
      );
    },
    [users, zapAmount, height, width],
  );
  if (events.length >= 3 && height) {
    return (
      <View style={{ flex: 1, width: '100%', height: '100%' }}>
        <FlashList
          data={events}
          renderItem={renderPost}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={(height / 100) * 90}
          estimatedItemSize={(height / 100) * 90}
          directionalLockEnabled
          extraData={[users, zapAmount]}
          getItemType={(item) => item.type}
          onEndReached={() => {
            get25RootPosts();
          }}
          onEndReachedThreshold={2}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refreshHandler}
          ref={listRef}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <View style={{ width: '100%' }}>
        <Text style={globalStyles.textBody}>
          {'No messages to display...\n'}
          <Text
            style={{ color: colors.primary500 }}
            onPress={() => {
              navigation.navigate('TwitterModal');
            }}
          >
            Find people to follow
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default HomeFeed;
