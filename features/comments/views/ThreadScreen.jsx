import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import useThread from '../hooks/useThread';
import { CustomKeyboardView, ExpandableInput } from '../../../components';
import { colors, globalStyles } from '../../../styles';
import PostMenuBottomSheet from '../../../components/PostMenuBottomSheet';
import Comment from '../components/Comment';
import { MyRefreshControl } from '../components/PullUp';
import { PullDownNote } from '../components';
import { publishReply } from '../utils/publishReply';

const styles = StyleSheet.create({
  baseContainer: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
  },
  replyContainer: {
    padding: 10,
    borderRadius: 10,
    borderColor: colors.backgroundSecondary,
    borderWidth: 1,
    marginVertical: 10,
  },
  threadInnerContainer: {
    borderColor: colors.backgroundSecondary,
    borderWidth: 1,
    padding: 10,
    marginVertical: 6,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  threadOuterContainer: {
    width: '96%',
    alignSelf: 'flex-end',
    borderLeftWidth: 1,
    borderLeftColor: colors.primary500,
  },
});

const ThreadScreen = ({ route }) => {
  const { eventId, noBar } = route?.params || {};
  const [refreshing, setRefreshing] = useState(false);

  const [thread, replies, startNote, showThread, setShowThread] = useThread(eventId);

  const listRef = useRef();
  const bottomSheetModalRef = useRef();

  const handlePresentModalPress = useCallback(
    (data) => {
      bottomSheetModalRef.current?.present(data);
    },
    [bottomSheetModalRef],
  );

  let notes;
  if (!showThread) {
    const sortedReplies = replies.sort((a, b) => b.createdAt - a.createdAt)
    notes = [
      { type: 'base', note: startNote },
      ...sortedReplies.map((note) => ({
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
      })).sort((a, b) => b.created_at - a.created_at),
    ];
  }

  const refreshHandler = () => {
    setRefreshing(true);
    setShowThread(true);
    setRefreshing(false);
  };

  const submitHandler = useCallback(
    async (input) => {
      const success = await publishReply(input, startNote);
      if (!success) {
        Alert.alert('Something went wrong publishing your note...');
      }
    },
    [startNote],
  );

  const renderItem = useCallback(
    ({ item, index}) => {
      if (item.type === 'base') {
        return (
          <View style={styles.baseContainer}>
            <Comment
              event={item.note}
              onMenu={handlePresentModalPress}
              inverted
            />
          </View>
        );
      }
      if (item.type === 'reply') {
        return (
          <View style={styles.replyContainer}>
            <Comment event={item.note} onMenu={handlePresentModalPress} />
          </View>
        );
      }
      return (
        <View style={styles.threadOuterContainer}>
          <View style={styles.threadInnerContainer}>
            <Comment event={item.note} small onMenu={handlePresentModalPress} />
          </View>
        </View>
      );
    },
    [handlePresentModalPress],
  );

  return (
    <CustomKeyboardView noBottomBar={noBar}>
      <View style={[globalStyles.screenContainer, { paddingTop: 0 }]}>
        {startNote ? (
          <View style={{ flex: 1, width: '100%' }}>
            <FlashList
              data={notes}
              renderItem={renderItem}
              estimatedItemSize={300}
              keyExtractor={(item) => item.note.id}
              ref={listRef}
              refreshing={refreshing}
              onRefresh={startNote.repliesTo ? refreshHandler : undefined}
              refreshControl={
                startNote.repliesTo ? (
                  <MyRefreshControl
                    onRefresh={refreshHandler}
                    refreshing={refreshing}
                  />
                ) : undefined
              }
              ListHeaderComponent={
                !showThread && startNote.repliesTo ? <PullDownNote /> : null
              }
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <ActivityIndicator style={{ flex: 1 }} />
        )}
        <ExpandableInput onSubmit={submitHandler} />
        <PostMenuBottomSheet ref={bottomSheetModalRef} />
      </View>
    </CustomKeyboardView>
  );
};

export default ThreadScreen;
