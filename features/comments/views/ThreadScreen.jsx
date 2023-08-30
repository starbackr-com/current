import { View, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import useThread from '../hooks/useThread';
import { CustomKeyboardView, ExpandableInput } from '../../../components';
import { colors, globalStyles } from '../../../styles';
import PostMenuBottomSheet from '../../../components/PostMenuBottomSheet';
import Comment from '../components/Comment';
import { Text } from 'react-native';
import { MyRefreshControl } from '../components/PullUp';

const ThreadScreen = ({ route }) => {
  const { eventId } = route?.params || {};
  const [showThreads, setShowThreads] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [thread, replies, startNote] = useThread(eventId);
  const listRef = useRef();

  let notes;
  if (!showThreads) {
    notes = [
      { type: 'base', note: startNote },
      ...replies.map((note) => ({
        type: 'reply',
        note,
      })),
    ];
  } else {
    notes = [
      ...thread.map((note) => ({
        type: 'thread',
        note,
      })),
      { type: 'base', note: startNote },
      ...replies.map((note) => ({
        type: 'reply',
        note,
      })),
    ];
  }
  const refreshHandler = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setShowThreads(true);
      setRefreshing(false);
    }, 1000);
  }, []);
  const renderItem = ({ item, index }) => {
    if (item.type === 'base') {
      return (
        <View
          style={{
            width: '100%',
            backgroundColor: colors.backgroundSecondary,
          }}
        >
          <Comment event={item.note} />
        </View>
      );
    }
    return (
      <View
        style={{
          width: '98%',
          alignSelf: 'flex-end',
          borderLeftWidth: 2,
          borderLeftColor: colors.backgroundSecondary,
          paddingLeft: 12,
        }}
      >
        <Comment event={item.note} />
      </View>
    );
  };

  return (
    <CustomKeyboardView>
      <View style={globalStyles.screenContainer}>
        {startNote ? (
          <View style={{ flex: 1, width: '100%' }}>
            <FlashList
              data={notes}
              renderItem={renderItem}
              estimatedItemSize={300}
              keyExtractor={(item) => item.note.id}
              ref={listRef}
              onRefresh={refreshHandler}
              refreshing={refreshing}
              refreshControl={<MyRefreshControl refreshing={refreshing} onRefresh={refreshHandler}/>}
              ListHeaderComponent={!showThreads ? <Text style={globalStyles.textBodyS}>Pull down to load Thread</Text> : null}
            />
          </View>
        ) : (
          <ActivityIndicator style={{ flex: 1 }} />
        )}
        <ExpandableInput />
        <PostMenuBottomSheet />
      </View>
    </CustomKeyboardView>
  );
};

export default ThreadScreen;
