import { View, Text } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import ImagePost from './ImagePost';
import PostItem from './PostItem';
import { useSelector } from 'react-redux';
import { getZaps } from '../../zaps/utils/getZaps';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { usePaginatedFeed } from '../hooks/usePaginatedFeed';
import { colors, globalStyles } from '../../../styles';

const HomeFeed = ({ width, height }) => {
  const [checkedZaps, setCheckedZaps] = useState([]);
  const [zaps, setZaps] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const listRef = useRef();

  const zapAmount = useSelector((state) => state.user.zapAmount);
  const users = useSelector((state) => state.messages.users);

  const now = new Date() / 1000;

  const [get25RootPosts, refresh, events] = usePaginatedFeed(now);
  const navigation = useNavigation();
  useScrollToTop(listRef);

  const loadZaps = async (arrayOfIds) => {
    const allZaps = await getZaps(arrayOfIds);
    setZaps((prev) => Object.assign(prev || {}, allZaps));
  };

  const refreshHandler = useCallback(() => {
    setRefreshing(true);
    refresh();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const eventIds = events.map((event) => event.id);
      const toCheck = eventIds.filter((id) => !checkedZaps.includes(id));
      loadZaps(toCheck);
      setCheckedZaps((prev) => [...prev, toCheck]);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [events]);

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
            zaps={zaps ? zaps[item.id] : null}
          />
        );
      } else {
        return (
          <PostItem
            item={item}
            height={height}
            width={width}
            user={users[item.pubkey]}
            zapAmount={zapAmount}
            zaps={zaps ? zaps[item.id] : null}
          />
        );
      }
    },
    [users, zapAmount, zaps, height, width],
  );
  return (
    <>
      {events.length >= 3 && height ? (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
          <FlashList
            data={events}
            renderItem={renderPost}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={(height / 100) * 90}
            estimatedItemSize={(height / 100) * 90}
            directionalLockEnabled
            extraData={[users, zapAmount, zaps]}
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
      ) : (
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
      )}
    </>
  );
};

export default HomeFeed;
