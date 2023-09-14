import { View, Text, Pressable } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../../styles';
import NewPostButton from './NewPostButton';
import PostMenuBottomSheet from '../../../components/PostMenuBottomSheet';
import TextPost from './TextPost';
import FullImagePost from './FullImagePost';
import useDatabaseFeed from '../hooks/useDatabaseFeed';
import { MenuBottomSheet, SwitchBar } from '../../../components';

const HomeFeed = ({ width, height }) => {
  const listRef = useRef();
  const modalRef = useRef();
  const filterRef = useRef();
  const [filter, setFilter] = useState({
    text: true,
    images: false,
  });

  const [filteredNotes, setPage] = useDatabaseFeed(filter);

  const zapAmount = useSelector((state) => state.user.zapAmount);
  const navigation = useNavigation();
  useScrollToTop(listRef);

  const onMenuHandler = useCallback(
    (data) => {
      modalRef.current.present(data);
    },
    [modalRef],
  );

  const renderPost = useCallback(
    ({ item, index }) => {
      if (index === 0) {
        if (item?.images?.length > 0) {
          return (
            <FullImagePost
              item={item}
              height={height - 50}
              width={width}
              zapAmount={zapAmount}
              onMenu={onMenuHandler}
            />
          );
        }
        return (
          <TextPost
            item={item}
            height={height - 50}
            width={width}
            zapAmount={zapAmount}
            onMenu={onMenuHandler}
          />
        );
      }
      if (item?.images?.length > 0) {
        return (
          <FullImagePost
            item={item}
            height={height}
            width={width}
            zapAmount={zapAmount}
            onMenu={onMenuHandler}
          />
        );
      }
      return (
        <TextPost
          item={item}
          height={height}
          width={width}
          zapAmount={zapAmount}
          onMenu={onMenuHandler}
        />
      );
    },
    [zapAmount, height, width],
  );
  if (filteredNotes.length >= 5 && height) {
    return (
      <View style={{ flex: 1, width: '100%', height: '100%' }}>
        <FlashList
          data={filteredNotes}
          renderItem={renderPost}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={height}
          estimatedItemSize={height}
          directionalLockEnabled
          extraData={[zapAmount]}
          getItemType={(item) => (item.images.length > 0 ? 'image' : 'text')}
          onEndReached={() => {
            setPage((p) => p + 1);
          }}
          onEndReachedThreshold={3}
          showsVerticalScrollIndicator={false}
          ref={listRef}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={
            <Pressable
              style={({ pressed }) => ({
                height: 44,
                flex: 1,
                backgroundColor: pressed
                  ? colors.backgroundActive
                  : colors.backgroundSecondary,
                marginTop: 6,
                marginHorizontal: 6,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                flexDirection: 'row',
              })}
              onPress={() => {
                filterRef.current.present();
              }}
            >
              <Ionicons name="filter" color={colors.primary500} size={16} />
              <Text style={globalStyles.textBodyS}>Filter</Text>
            </Pressable>
          }
        />
        <NewPostButton />
        <PostMenuBottomSheet ref={modalRef} />
        <MenuBottomSheet ref={filterRef}>
          <View style={{ gap: 2 }}>
            <SwitchBar
              text="Show Text Posts"
              value={filter.text}
              onChange={() => {
                setFilter((p) => ({ ...filter, text: !p.text }));
              }}
            />
            <SwitchBar
              text="Show Image Posts"
              value={filter.images}
              onChange={() => {
                setFilter((p) => ({ ...filter, images: !p.images }));
              }}
            />
          </View>
        </MenuBottomSheet>
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
